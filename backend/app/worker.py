from celery import Celery

from app.config import settings

celery_app = Celery(
    "shoesbags",
    broker=settings.RABBITMQ_URL,
    backend="rpc://",
    include=["app.tasks.email_tasks"],
)

celery_app.conf.task_routes = {
    "app.tasks.email_tasks.*": {"queue": "emails"},
}
