import pytest
from app.database import engine, Base
from app.models.task import Task

@pytest.fixture(autouse=True)
def setup_db():
    Base.metadata.create_all(bind=engine)
    yield
