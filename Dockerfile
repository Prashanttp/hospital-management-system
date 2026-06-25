#FROM eclipse-temurin:21-jdk
#
#WORKDIR /app
#
#COPY target/hospitalManagement-0.0.1-SNAPSHOT.jar app.jar
#
#EXPOSE 8080
#
#ENTRYPOINT ["java","-jar","app.jar"]
FROM eclipse-temurin:21-jdk

WORKDIR /app

COPY . .

RUN chmod +x mvnw

RUN ./mvnw clean package -DskipTests

EXPOSE 8080

CMD ["java","-jar","target/hospitalManagement-0.0.1-SNAPSHOT.jar"]