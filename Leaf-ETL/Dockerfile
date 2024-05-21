# Create python image and set working directory to /app
FROM python:3.9-slim-buster
WORKDIR /app

# Copy requirements into working directory and install
COPY ./requirements.txt /app
RUN pip install -r requirements.txt

# Copy in source code and run flask app
COPY . .
EXPOSE 5000
ENV FLASK_APP=flaskr/__init__.py
CMD ["flask", "run", "--host", "0.0.0.0"]
