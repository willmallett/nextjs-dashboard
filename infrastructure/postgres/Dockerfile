FROM postgres:14.3-alpine

ADD create-db.sql /docker-entrypoint-initdb.d/

EXPOSE 5432

CMD ["postgres"]
