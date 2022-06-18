FROM tiangolo/uvicorn-gunicorn-fastapi:python3.8

ENV PORT="5000"

COPY ./requirements.txt /app/requirements.txt

RUN pip install --no-cache-dir --upgrade -r /app/requirements.txt

COPY ./app /app/app
