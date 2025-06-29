FROM postgres:15-alpine

# Install additional extensions
RUN apk add --no-cache postgresql-contrib

# Copy custom configuration
COPY postgresql.conf /etc/postgresql/postgresql.conf
COPY init.sql /docker-entrypoint-initdb.d/

# Set permissions
RUN chmod 644 /etc/postgresql/postgresql.conf
RUN chmod 755 /docker-entrypoint-initdb.d/init.sql

# Expose port
EXPOSE 5432

# Use custom config
CMD ["postgres", "-c", "config_file=/etc/postgresql/postgresql.conf"]