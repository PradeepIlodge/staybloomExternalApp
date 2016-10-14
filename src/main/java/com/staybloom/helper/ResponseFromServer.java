package com.staybloom.helper;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.MalformedURLException;
import java.net.URL;
import java.util.logging.Logger;

public class ResponseFromServer {

	private static Logger LOGGER = Logger.getLogger(ResponseFromServer.class.getName());
	public static void main(String[] args) {
		//System.out.println(AuthenticateUser.authenticateUser("", "rishabh011@gmail.com", "CAIaFHJpc2hhYmgwMTFAZ21haWwuY29t"));
	}

	public static String getResponseFromServer(String url, String queryString) {
		HttpURLConnection connection = null;
		BufferedReader serverResponse = null;
		try
		{
			//OPEN CONNECTION
			connection = (HttpURLConnection) new URL(url+"?"+queryString).openConnection();
			connection.setRequestMethod("GET");
			serverResponse = new BufferedReader(new InputStreamReader(connection.getInputStream()));
			String line;
			StringBuffer completeResponse = new StringBuffer();
			while ((line = serverResponse.readLine()) != null) 
				completeResponse.append(line);
			return completeResponse.toString();
		}
		catch (MalformedURLException mue) {
			mue.printStackTrace();
		} catch (IOException ioe) {
			ioe.printStackTrace();
		} finally {
			if ( connection != null )
				connection.disconnect();
			if ( serverResponse != null ) {
				try { serverResponse.close(); } catch (Exception ex) {}
			}
		}
		return "";
	}
	

	public static String postResponseFromServer(String urlStr, String payLoad) throws IOException {
		
		LOGGER.info("chaakas : reached postResponseFromServer");
		URL url = new URL(urlStr);
        byte[] postDataBytes = payLoad == null ? "".getBytes("UTF-8") : payLoad.getBytes("UTF-8");

        HttpURLConnection conn = (HttpURLConnection)url.openConnection();
        conn.setRequestMethod("POST");
        conn.setRequestProperty("Content-Type", "application/x-www-form-urlencoded");
        conn.setRequestProperty("Content-Length", String.valueOf(postDataBytes.length));
        conn.setDoOutput(true);
        conn.getOutputStream().write(postDataBytes);

        LOGGER.info("chaakas : postDataBytes - "+postDataBytes.toString());
		
        String line;
		StringBuffer completeResponse = new StringBuffer();
        BufferedReader serverResponse = new BufferedReader(new InputStreamReader(conn.getInputStream(), "UTF-8"));
        while ( (line = serverResponse.readLine() ) != null )
        	completeResponse = completeResponse.append(line);
        //LOGGER.info("chaakas : completeResponse - "+completeResponse);
		return completeResponse.toString();
        
	}
}
