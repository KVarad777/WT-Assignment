# 🛠️ Installation & Deployment Guide

This guide walks through everything needed to get **Voltage — Electricity
Bill Calculator** running from a completely fresh machine: installing the
JDK, Maven, and Tomcat, importing the project into an IDE, building it, and
deploying it — no MySQL required.

---

## 1. Install Java JDK (17 or later)

The project targets Java 17.

**Windows / macOS / Linux:**
1. Download a JDK 17+ build — e.g. [Eclipse Temurin](https://adoptium.net/) (recommended, free).
2. Run the installer and follow the prompts.
3. Verify the install:
   ```bash
   java -version
   javac -version
   ```
   Both should report `17` or higher.
4. Ensure `JAVA_HOME` is set:
   - **Windows:** System Properties → Environment Variables → add `JAVA_HOME` pointing to the JDK install folder (e.g. `C:\Program Files\Eclipse Adoptium\jdk-17...`), and add `%JAVA_HOME%\bin` to `PATH`.
   - **macOS/Linux:** add to `~/.zshrc` / `~/.bashrc`:
     ```bash
     export JAVA_HOME=$(/usr/libexec/java_home -v 17)   # macOS
     export PATH=$JAVA_HOME/bin:$PATH
     ```

---

## 2. Install Maven

1. Download Maven from [maven.apache.org/download.cgi](https://maven.apache.org/download.cgi) (Binary zip/tar.gz archive).
2. Extract it, e.g. to `C:\apache-maven-3.9.x` or `/opt/apache-maven-3.9.x`.
3. Add its `bin` folder to your `PATH`:
   - **Windows:** add `C:\apache-maven-3.9.x\bin` to `PATH`.
   - **macOS/Linux:**
     ```bash
     export MAVEN_HOME=/opt/apache-maven-3.9.x
     export PATH=$MAVEN_HOME/bin:$PATH
     ```
4. Verify:
   ```bash
   mvn -version
   ```
   Confirm it reports the JDK 17 you installed in Step 1.

> On macOS you can alternatively `brew install maven`; on Ubuntu/Debian, `sudo apt install maven` (check the packaged version is recent enough).

---

## 3. Install Apache Tomcat 10.1+

This project uses the **Jakarta EE namespace** (`jakarta.servlet.*`), which
requires **Tomcat 10.1 or later** (Tomcat 10.0.x and 9.x use the older
`javax.servlet` namespace and will **not** work).

1. Download **Tomcat 10.1.x** from [tomcat.apache.org/download-10.cgi](https://tomcat.apache.org/download-10.cgi) — choose the "Core" zip/tar.gz.
2. Extract it to a folder of your choice, e.g. `/opt/tomcat10` or `C:\tomcat10`.
3. (Optional) Edit `conf/tomcat-users.xml` to add a manager user if you want to use the web-based Tomcat Manager app to deploy WARs:
   ```xml
   <role rolename="manager-gui"/>
   <user username="admin" password="changeit" roles="manager-gui"/>
   ```
4. Start Tomcat to confirm it works:
   - **Windows:** `bin\startup.bat`
   - **macOS/Linux:** `bin/startup.sh` (you may need `chmod +x bin/*.sh` first)
5. Visit `http://localhost:8080` — you should see the default Tomcat welcome page.
6. Stop it again before deploying the app: `bin/shutdown.sh` / `bin\shutdown.bat`.

---

## 4. Import the Project

The project is a standard Maven project (`pom.xml` at the root), so it
imports cleanly into either Eclipse or IntelliJ IDEA.

### Import into Eclipse (2023-06 / "Eclipse IDE for Enterprise Java and Web Developers" recommended)

1. Unzip `electricity-bill-calculator.zip` somewhere on disk.
2. In Eclipse: **File → Import… → Maven → Existing Maven Projects**.
3. Click **Next**, then **Browse…** and select the unzipped `electricity-bill-calculator` folder.
4. Eclipse will detect `pom.xml` — leave it checked, click **Finish**.
5. Right-click the project → **Properties → Project Facets** — confirm "Dynamic Web Module" and "Java" facets are present (the Maven WAR packaging should configure this automatically; if not, add the "Dynamic Web Module" facet manually, version 6.0, and set "Java" to 17).
6. **Register Tomcat:** Window → Preferences → Server → Runtime Environments → **Add… → Apache Tomcat v10.1** → point it at the folder from Step 3.
7. Right-click the project → **Run As → Run on Server**, choose the Tomcat 10.1 server, and click **Finish**.

### Import into IntelliJ IDEA (Ultimate edition, for Tomcat/Servlet support)

1. Unzip the project.
2. **File → Open…** and select the unzipped `electricity-bill-calculator` folder (the one containing `pom.xml`). IntelliJ will detect it as a Maven project and import dependencies automatically.
3. **File → Project Structure → Project** — set the Project SDK to JDK 17.
4. **Run → Edit Configurations… → + → Tomcat Server → Local**.
5. Under "Application server", click **Configure…** and point to your Tomcat 10.1 install folder from Step 3.
6. On the **Deployment** tab of the run configuration, click **+ → Artifact** and choose `electricity-bill-calculator:war` (or `war exploded` for faster iterative development).
7. Click **OK**, then press the green **Run** button.

> IntelliJ Community Edition does not include built-in application-server run configurations. You can still build the project with `mvn clean package` and deploy the resulting WAR manually (see Step 6 below).

---

## 5. Run Maven (build the project)

From the project root (where `pom.xml` lives):

```bash
mvn clean package
```

This compiles all Java sources, runs the WAR packaging, and produces:

```
target/electricity-bill-calculator.war
```

To just compile without packaging (faster, for a syntax check):

```bash
mvn clean compile
```

---

## 6. Deploy on Tomcat

You have two options:

### Option A — Copy the WAR (simplest)

1. Build the project: `mvn clean package`.
2. Copy `target/electricity-bill-calculator.war` into Tomcat's `webapps/` folder.
3. Start Tomcat (`bin/startup.sh` or `bin\startup.bat`). Tomcat will auto-detect and unpack the WAR.
4. Watch `logs/catalina.out` (or the console window on Windows) for a line confirming the app deployed without errors.

### Option B — Deploy via Tomcat Manager

1. Build the project as above.
2. Start Tomcat and go to `http://localhost:8080/manager/html` (login with the credentials you set in `tomcat-users.xml`).
3. Under "WAR file to deploy", choose `electricity-bill-calculator.war` and click **Deploy**.

### Option C — Run directly from your IDE

If you registered Tomcat inside Eclipse or IntelliJ (Step 4), simply use
**Run on Server** / the green **Run** button — the IDE builds and deploys
for you automatically, and can also enable hot-reload for JSP changes.

---

## 7. Access the Application

Once deployed, open your browser to:

```
http://localhost:8080/electricity-bill-calculator/
```

(If you changed the WAR's file name, or deployed it under a different
context path, adjust the URL accordingly — the path segment after the port
matches the WAR file name / context root.)

You should see the **Voltage** home page. From there:
- **Calculator** (`/calculator`) — enter customer details and units to generate a bill.
- **History** (`/history`) — view, search, sort, and delete previously generated bills.
- **About** / **Contact** — informational pages.

No database setup, connection strings, or credentials are required — the
app runs entirely on the in-memory repository described in `README.md`.

---

## Troubleshooting

| Problem | Likely Cause | Fix |
|---|---|---|
| `HTTP 404` at the root URL | Wrong context path in the URL | Match the WAR's file name, e.g. `/electricity-bill-calculator/` |
| `ClassNotFoundException: jakarta.servlet...` | Tomcat version too old | Use Tomcat **10.1+**, not 9.x or 10.0.x |
| Blank/broken styling | No internet access | The UI loads Bootstrap, Bootstrap Icons, and Google Fonts from a CDN — ensure the deployment machine has outbound internet access, or vendor the assets locally |
| JSP compile errors mentioning `c:` or `fmt:` tags | JSTL jars missing | Confirm `mvn clean package` completed successfully so JSTL is bundled in `WEB-INF/lib` inside the WAR |
| Changes to `.java` files don't appear | Old WAR still deployed | Re-run `mvn clean package` and redeploy, or use your IDE's "Run on Server" hot-deploy |
