FROM linuxconfig/apache
ENV DEBIAN_FRONTEND noninteractive

# Main package installation
RUN apt update
RUN apt -y install supervisor libapache2-mod-php php-mysql mariadb-server

# Extra package installation
RUN apt-get -y install vim wget php-gd php-apcu php-mcrypt php-xml phpmyadmin

# Configure MariaDB
RUN sed -i 's/bind-address/#bind-address/' /etc/mysql/my.cnf

# Include supervisor configuration
ADD supervisor-lamp.conf /etc/supervisor/conf.d/
ADD supervisord.conf /etc/supervisor/

#activate mod_rewrite
RUN pushd /etc/apache2/mods-enabled; ln -sf ./mods-available/rewrite.load; popd;

#Activate PHPMYADMIN
echo 'Include /etc/phpmyadmin/apache.conf' >> /etc/apache2/apache2.conf

# Create new MariaDB admin user
RUN service mysql start; mysql -u root -e "CREATE USER 'admin'@'%' IDENTIFIED BY 'pass';";mysql -u root -e "GRANT ALL PRIVILEGES ON *.* TO 'admin'@'%' WITH GRANT OPTION;"; 

# Allow ports
EXPOSE 80 3306

# Start supervisor
CMD ["supervisord"]
