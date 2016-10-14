package com.staybloom.filters;

import java.io.IOException;
import java.util.logging.Logger;

import javax.servlet.Filter;
import javax.servlet.FilterChain;
import javax.servlet.FilterConfig;
import javax.servlet.ServletException;
import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;
import javax.servlet.http.HttpServletRequest;

import com.staybloom.helper.AuthenticateUser;

public class AuthenticationFilter implements Filter {

	private static Logger LOGGER = Logger.getLogger(AuthenticationFilter.class.getName());
	
	@Override
	public void doFilter(ServletRequest req, ServletResponse resp, FilterChain chain) throws IOException,
			ServletException {
		LOGGER.info("chaakas : hello from filter");
		HttpServletRequest request = (HttpServletRequest) req;
		LOGGER.info("chaakas : request.getMethod() - "+request.getMethod());
		if(request.getMethod().equals("POST")) {
			boolean authenticated = AuthenticateUser.authenticateUser(request);
			LOGGER.info("chaakas : AuthenticateUser.authenticateUser(authEmail, auth) - "+authenticated);
			if(!authenticated)
				return;
		}
		chain.doFilter(req, resp);
		LOGGER.info("chaakas : bye from filter");
	}

	@Override
	public void destroy() {
		// TODO Auto-generated method stub
	}

	@Override
	public void init(FilterConfig arg0) throws ServletException {
		// TODO Auto-generated method stub
	}

}
