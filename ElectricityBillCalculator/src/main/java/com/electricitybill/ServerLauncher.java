package com.electricitybill;

import org.apache.catalina.WebResourceRoot;
import org.apache.catalina.core.StandardContext;
import org.apache.catalina.startup.Tomcat;
import org.apache.catalina.webresources.DirResourceSet;
import org.apache.catalina.webresources.StandardRoot;

import java.io.File;

/**
 * Embedded Tomcat Launcher for ElectroBill.
 * Allows running the full Jakarta Servlet + JSP application directly.
 */
public class ServerLauncher {

    public static void main(String[] args) throws Exception {
        int port = 8080;
        String portStr = System.getenv("PORT");
        if (portStr != null && !portStr.isEmpty()) {
            port = Integer.parseInt(portStr);
        }

        Tomcat tomcat = new Tomcat();
        tomcat.setPort(port);
        tomcat.setBaseDir("target/tomcat-temp");
        tomcat.getConnector(); // initialize default connector

        String webappDir = new File("src/main/webapp").getAbsolutePath();
        File classesDir = new File("target/classes");

        // 1. Root Context ("/")
        StandardContext ctxRoot = (StandardContext) tomcat.addWebapp("", webappDir);
        ctxRoot.setParentClassLoader(ServerLauncher.class.getClassLoader());
        if (classesDir.exists()) {
            WebResourceRoot rootResources = new StandardRoot(ctxRoot);
            rootResources.addPreResources(new DirResourceSet(rootResources, "/WEB-INF/classes",
                    classesDir.getAbsolutePath(), "/"));
            ctxRoot.setResources(rootResources);
        }

        // 2. Named Context ("/ElectricityBillCalculator")
        StandardContext ctxApp = (StandardContext) tomcat.addWebapp("/ElectricityBillCalculator", webappDir);
        ctxApp.setParentClassLoader(ServerLauncher.class.getClassLoader());
        if (classesDir.exists()) {
            WebResourceRoot appResources = new StandardRoot(ctxApp);
            appResources.addPreResources(new DirResourceSet(appResources, "/WEB-INF/classes",
                    classesDir.getAbsolutePath(), "/"));
            ctxApp.setResources(appResources);
        }

        System.out.println("==================================================================");
        System.out.println("⚡ ElectroBill Application Server Started!");
        System.out.println("👉 Access at: http://localhost:" + port + "/");
        System.out.println("👉 Or at:     http://localhost:" + port + "/ElectricityBillCalculator/");
        System.out.println("==================================================================");

        tomcat.start();
        tomcat.getServer().await();
    }
}
