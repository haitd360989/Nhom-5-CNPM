from fastapi import APIRouter, Depends
from app.models import User, UserRole
from app.rbac import require_roles

router=APIRouter(prefix="/api/v1/rbac",tags=["RBAC"])

@router.get("/admin")
def admin_resource(user:User=Depends(require_roles(UserRole.ADMIN))):
    return {"message":"Admin resource","user_id":user.id,"role":user.role.value}

@router.get("/teacher")
def teacher_resource(user:User=Depends(require_roles(UserRole.ADMIN,UserRole.TEACHER))):
    return {"message":"Teacher resource","user_id":user.id,"role":user.role.value}

@router.get("/student")
def student_resource(user:User=Depends(require_roles(UserRole.ADMIN,UserRole.STUDENT))):
    return {"message":"Student resource","user_id":user.id,"role":user.role.value}

@router.get("/parent")
def parent_resource(user:User=Depends(require_roles(UserRole.ADMIN,UserRole.PARENT))):
    return {"message":"Parent resource","user_id":user.id,"role":user.role.value}
