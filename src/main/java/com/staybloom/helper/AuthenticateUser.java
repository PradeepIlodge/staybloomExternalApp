package com.staybloom.helper;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.PrintWriter;
import java.net.HttpURLConnection;
import java.net.MalformedURLException;
import java.net.URL;
import java.util.logging.Logger;

import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;

public class AuthenticateUser {

	private static Logger LOGGER = Logger.getLogger(AuthenticateUser.class.getName());
	
	public static void main(String[] args) throws MalformedURLException, IOException {
		HttpURLConnection connection = null;
		connection = (HttpURLConnection) new URL("http://localhost/pmsServerSB").openConnection();
		connection.setRequestProperty("Cookie", "authEmail=CAIaFHJpc2hhYmgwMTFAZ21haWwuY29t; authEmail=rishabh011@gmail.com");
	}
	
	public static boolean authenticateUser(HttpServletRequest request) {
		HttpURLConnection connection = null;
		PrintWriter outWriter = null;
		BufferedReader serverResponse = null;
		StringBuffer buff = new StringBuffer();
		String auth = null;
		String authEmail = null;
		try {
			Cookie[] cookies = request.getCookies();
			for(Cookie cookie : cookies) {
				if(cookie.getName().equals("auth")) {
					LOGGER.info("chaakas : auth - "+cookie.getValue());
					auth = cookie.getValue();
				} else if(cookie.getName().equals("authEmail")) {
					LOGGER.info("chaakas : authEmail - "+cookie.getValue());
					authEmail = cookie.getValue();
				}
			}
			
			//OPEN CONNECTION
			connection = (HttpURLConnection) new URL
					(getAuthenticationURL(request)+"?auth="+auth+"&authEmail="+authEmail).openConnection();

			serverResponse = new BufferedReader(new InputStreamReader(connection.getInputStream()));

			//READ THE RESPOSNE
			String responseLine;
			responseLine = serverResponse.readLine();
			LOGGER.info("chaakas : serverResponse from Authenticateuser - "+responseLine);
			return responseLine.equals("true");
		}
		catch (Exception e) {
			e.printStackTrace();
		} finally {
			if (connection != null)
				connection.disconnect();
			if (serverResponse != null) {
				try {serverResponse.close();} catch (Exception ex) {}
			}
		}
		return false;
	}
	
	private static String getAuthenticationURL(HttpServletRequest request) {
		String url = request.getRequestURL().toString(); 
		return url.replaceAll(request.getRequestURI(), "/pmsServerSB/verifyProfile");
	}
}
