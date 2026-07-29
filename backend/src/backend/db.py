from sqlalchemy import create_engine,ForeignKey 
from sqlalchemy.orm import Session,DeclarativeBase,Mapped,mapped_column,relationship,sessionmaker
from datetime import datetime,timezone
from dotenv import load_dotenv,find_dotenv
import os

_:bool=load_dotenv(find_dotenv())

DB_URI=os.environ.get("DB_URI")

class Base(DeclarativeBase):
        pass

class Chats(Base):
    __tablename__="chat_table"
    id:Mapped[int]=mapped_column(primary_key=True)
    thread_id:Mapped[str]=mapped_column(nullable=False,unique=True)
    chat_name:Mapped[str]=mapped_column(nullable=False)
    created_at:Mapped[datetime]=mapped_column(default=datetime.now(timezone.utc))
    user_id:Mapped[str]=mapped_column(ForeignKey("users.id",ondelete="CASCADE"))
    def __repr__(self)->str:
        return f"<Chats {self.chat_name}>"

class User(Base):
    __tablename__="users"
    id:Mapped[int]=mapped_column(primary_key=True)
    email:Mapped[str]=mapped_column(nullable=False,unique=True)
    hashed_password:Mapped[str]=mapped_column(nullable=False)
    chats:Mapped[list["Chats"]]=relationship(backref="chats",passive_deletes=True)
    def __repr__(self)->str:
        return f"<Users {self.email}>"


engine=create_engine(DB_URI,echo=True)
# Base.metadata.create_all(bind=engine)

session=sessionmaker(bind=engine)

def get_db():
    db:Session=session()
    try:
        yield db
    finally:
        db.close()



