class Settings:
    DATABASE_URL = 'postgresql+psycopg2://neondb_owner:npg_jPveiQL8m7fx@ep-calm-tree-adumig8l-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require'

    API_PREFIX: str = "/api"
    DEBUG: bool = True

    ALLOWED_ORIGINS = '*'

    SECRET_KEY = '83daa0256a2289b0fb23693bf1f6034d44396675749244721a2b20e896e11662'
    ALGORITHM = 'HS256'
    ACCESS_TOKEN_EXPIRE_MINUTES = 30

    CASHFREE_APP_ID = "TEST10938979069e97341b19a421fda697983901"
    CASHFREE_SECRET_KEY = "cfsk_ma_test_6a0c2dc8064c524457518a4dd335a2d8_0047de90"
    CASHFREE_ENV: str = "sandbox"  # or "production"

    FRONTEND_BASE_URL = "https://eleganza-ten.vercel.app"

settings = Settings()




