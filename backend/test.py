import bcrypt
from passlib.context import CryptContext
pwd = "admin123"
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
print(pwd_context.hash(pwd))

