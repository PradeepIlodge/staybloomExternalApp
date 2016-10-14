package com.staybloom.listener;

import java.util.Timer;
import java.util.TimerTask;
import java.util.logging.Logger;

import javax.servlet.ServletContextEvent;
import javax.servlet.ServletContextListener;

import com.staybloom.helper.ResponseFromServer;

public class AppContextListener implements ServletContextListener{
	private static Logger LOGGER = Logger.getLogger(AppContextListener.class.getName());

	@Override
	public void contextInitialized(final ServletContextEvent sce) {
		TimerTask task = new TimerTask() {
			@Override
			public void run() {
				try {
					String pmsServerSBRequest = "http://localhost/pmsServerSB";
					String loginRequest = "http://localhost/pmsServerSB/login";
					String exportRequest = "http://localhost/pmsServerSB/export"; 
					try{
						String pmsServerSBResponse = ResponseFromServer.getResponseFromServer(pmsServerSBRequest, "");
						LOGGER.info("Request : "+pmsServerSBRequest+" = Response : "+pmsServerSBResponse);
					}catch(Exception exception){
						exception.printStackTrace();
					}
					try{
						String loginResponse = ResponseFromServer.getResponseFromServer(loginRequest, "");
						LOGGER.info("Request : "+loginRequest+" = Response : "+loginResponse);
					}catch(Exception exception){
						exception.printStackTrace();
					}
					try{
						String exportResponse = ResponseFromServer.getResponseFromServer(exportRequest, "");
						LOGGER.info("Request : "+exportRequest+" = Response : "+exportResponse);
					}catch(Exception exception){
						exception.printStackTrace();
					}
				} catch (Exception e) {
					e.printStackTrace();
				}
			}
		};

		Timer timer = new Timer();
		long delay = 1;
		long intevalPeriod = 300 * 1000; 

		timer.scheduleAtFixedRate(task, delay, intevalPeriod);
	}

	@Override
	public void contextDestroyed(ServletContextEvent sce) {
	}
}
