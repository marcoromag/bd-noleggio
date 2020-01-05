FROM linuxconfig/apache
ENV DEBIAN_FRONTEND noninteractive

# Main package installation
RUN apt update
RUN apt -y install supervisor libapache2-mod-php php-mysql mariadb-server

# Extra package installation
RUN apt-get -y install vim wget php-gd php-apcu php-mcrypt php-xml phpmyadmin

# Configure MariaDB
RUN sed -i 's/bind-address/#bind-address/' /etc/mysql/my.cnf; \
    sed -i s/^bind-address.*/bind-address\ =\ 0.0.0.0/g  /etc/mysql/mariadb.conf.d/50-server.cnf

# Include supervisor configuration
ADD supervisor-lamp.confroot /etc/supervisor/conf.d/
ADD supervisord.conf /etc/supervisor/

#activate mod_rewrite
RUN ln -sf /etc/apache2/mods-available/rewrite.load /etc/apache2/mods-enabled;

#Expose MariaDB publicly

#Activate PHPMYADMIN
RUN echo 'Include /etc/phpmyadmin/apache.conf' >> /etc/apache2/apache2.conf

# Create new MariaDB admin user
RUN service mysql start; mysql -u root -e "CREATE USER 'admin'@'%' IDENTIFIED BY 'pass';";mysql -u root -e "GRANT ALL PRIVILEGES ON *.* TO 'admin'@'%' WITH GRANT OPTION;"; 

# Create database
ADD build/db /tmp/db
RUN service mysql start; cd /tmp/db; ./create_db.sh; rm -fr /tmp/db

#Add web part
ADD build/server/api /usr/share/api
ADD build/server/webapp /usr/share/webapp
ADD build/server/apache.conf /etc/apache2/conf-enabled/noleggio.conf

# Allow ports
EXPOSE 80 3306

# Start supervisor
CMD ["supervisord"]
