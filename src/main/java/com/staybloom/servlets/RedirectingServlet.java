package com.staybloom.servlets;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.PrintWriter;
import java.util.logging.Logger;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.staybloom.helper.ResponseFromServer;

public class RedirectingServlet extends HttpServlet {

	private static final long serialVersionUID = 1L;
	private static Logger LOGGER = Logger.getLogger(RedirectingServlet.class.getName());

	@Override
	public void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		LOGGER.info("hello from get");
		performGetTask(request, response);
	}
	
	@Override
	public void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		LOGGER.info("hello from post");
		performPostTask(request, response);
	}

	private void performGetTask(HttpServletRequest request, HttpServletResponse response)
			throws ServletException, IOException {
		System.out.println("chaakas : getRequestURL - "+request.getRequestURL().toString());
		System.out.println("chaakas : getRequestURI - "+request.getRequestURI());
		System.out.println("chaakas : getQueryString - "+request.getQueryString());
		System.out.println("chaakas : getLocalAddr - "+request.getLocalAddr());
		System.out.println("chaakas : getPathInfo - "+request.getPathInfo());
		System.out.println("chaakas : getProtocol - "+request.getProtocol());
		System.out.println("chaakas : getServerName - "+request.getServerName());
		System.out.println("chaakas : getServerPort - "+request.getServerPort());
		System.out.println("chaakas : getServletPath - "+request.getServletPath());
		System.out.println("chaakas : getMethod - "+request.getMethod());
		
		String url = urlModifier(request);
		//response.sendRedirect(url+ ((request.getQueryString() != null) ? "?"+request.getQueryString() : ""));
		//RequestDispatcher rd = request.getRequestDispatcher(url);
		//rd.forward(request, response);
		
		String resp = ResponseFromServer.getResponseFromServer(url, request.getQueryString());
		PrintWriter pw = response.getWriter();
		pw.write(resp);
		pw.flush();
		pw.close();
	}
	
	private void performPostTask(HttpServletRequest request, HttpServletResponse response)
			throws ServletException, IOException {
		System.out.println("chaakas : getRequestURL - "+request.getRequestURL().toString());
		System.out.println("chaakas : getRequestURI - "+request.getRequestURI());
		System.out.println("chaakas : getQueryString - "+request.getQueryString());
		System.out.println("chaakas : getLocalAddr - "+request.getLocalAddr());
		System.out.println("chaakas : getPathInfo - "+request.getPathInfo());
		System.out.println("chaakas : getProtocol - "+request.getProtocol());
		System.out.println("chaakas : getServerName - "+request.getServerName());
		System.out.println("chaakas : getServerPort - "+request.getServerPort());
		System.out.println("chaakas : getServletPath - "+request.getServletPath());
		System.out.println("chaakas : getMethod - "+request.getMethod());
		

//		String url = urlModifier(request);
//		response.sendRedirect(url+ ((request.getQueryString() != null) ? "?"+request.getQueryString() : ""));
		
		StringBuilder buffer = new StringBuilder();
	    BufferedReader reader = request.getReader();
	    String line;
	    while ((line = reader.readLine()) != null) {
	        buffer.append(line);
	    }
	    String data = buffer.toString();
		System.out.println("extracted data from post request  -  "+data);
		String url = urlModifier(request);
		String resp = ResponseFromServer.postResponseFromServer(url, data);
		PrintWriter pw = response.getWriter();
		pw.write(resp);
		pw.flush();
		pw.close();
	}
	
	private String urlModifier(HttpServletRequest request) {
		String originalUrl = request.getRequestURL().toString();
		LOGGER.info("original url = "+originalUrl);
		String modifiedUrl;
		if(request.getServerName().equals("localhost")) {
			modifiedUrl = originalUrl.toString().replaceAll("/staybloomExternalApp/zmoorrepus", "/pmsServerSB");
		} else {
			modifiedUrl = originalUrl.toString().replaceAll("/zmoorrepus", "/pmsServerSB");
		}
		LOGGER.info("modified url = "+modifiedUrl);
		return modifiedUrl;
	}
}