from datetime import datetime,timedelta,timezone
from passlib.context import CryptContext
from src.chatbot_backend.db import Session,User
from jose import jwt,JWTError

Secret_Key="My_Secret"
Algorithm="HS256"
access_time=30

pwd_context=CryptContext(schemes=["bcrypt"],deprecated="auto")

def verify_pass(password:str,hashed_pass:str):
    return pwd_context.verify(password,hashed_pass)

def get_hashed_pass(password:str):
    return pwd_context.hash(password)

def create_access_token(email:str):
    expire=datetime.now(timezone.utc)+timedelta(days=access_time)
    to_encode={"sub":email,"exp":expire}
    encoded_jwt=jwt.encode(to_encode,Secret_Key,Algorithm)
    return encoded_jwt

def decode_access_token(db:Session,token:str):
    try:
        payload=jwt.decode(token,Secret_Key,algorithms=[Algorithm])
        email:str=payload["sub"]
        user=db.query(User).filter_by(email=email).first()
        if user:
            return user
        else:
            return {"error":"No user found"}
    except JWTError as e:
        return {"error":f"error while decoding jwt : {e}"}
    except Exception as e:
        return {"error":f"General Exception : {e}"}

def get_user(email:str,password:str,db:Session):
    try:
        user=db.query(User).filter_by(email=email).first()
        if user:
            if verify_pass(hashed_pass=user.hashed_password,password=password):
                access_token=create_access_token(email=user.email)
                db.commit()
                db.refresh(user)
                return {"user":user,"access_token":access_token}
            else:
                return {"error":"Invalid password","type":"password"}
        else:
            return {"error":"No user found","type":"account"}
    except Exception as e:
        return {"Exception":e,"type":"exception"}
        
def signup_user(db:Session,email:str,password:str):
    try:
        user=db.query(User).filter_by(email=email).first()
        if user:
            return {"error":"User already exists","type":"account"}
        else:
            hashed_pass=get_hashed_pass(password)
            new_user=User(email=email,hashed_password=hashed_pass)
            access_token=create_access_token(email=email)
            db.add(new_user)
            db.commit()
            db.refresh(new_user)
            db.commit()
            db.refresh(new_user)
            return {"new_user":new_user,"access_token":access_token}
    except Exception as e:
        return {"error":e,"type":"exception"}
    
