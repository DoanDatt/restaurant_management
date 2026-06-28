import authApiRequest from "@/src/apiRequest/auth";
import { LoginBodyType } from "@/src/schemaValidations/auth.schema";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { HttpError } from "@/src/lib/http";

export async function POST(request: Request) {
        // đọc dữ liệu từ request gửi lên và parse nó thành JS object, sau đó ép kiểu về LoginBodyType
    const res = (await request.json()) as LoginBodyType;
    try {
        // khởi tạo cookieStore để lưu trữ cookie
        const cookieStore = await cookies();
        // gọi API đăng nhập và nhận về payload chứa accessToken và refreshToken
        const { payload } = await authApiRequest.SLogin(res);
        // lấy accessToken và refreshToken từ payload
        const {
            data: { accessToken, refreshToken }
        } = payload;
        // giải mã accessToken và refreshToken để lấy thông tin thời gian hết hạn (exp)
        const decodedAccessToken = jwt.decode(accessToken) as { exp: number };
        const decodedRefreshToken = jwt.decode(refreshToken) as { exp: number };
        // lưu trữ accessToken và refreshToken vào cookie với các tùy chọn bảo mật
        cookieStore.set("accessToken", accessToken, {
            path: "/",
            httpOnly: true,
            sameSite: "lax",
            secure: true,
            expires: new Date(decodedAccessToken.exp * 1000)
        });

        cookieStore.set("refreshToken", refreshToken, {
            path: "/",
            httpOnly: true,
            sameSite: "lax",
            secure: true,
            expires: new Date(decodedRefreshToken.exp * 1000)
        });
        // trả về payload chứa thông tin người dùng và token parse về kiểu JavaScript object
        return Response.json(payload)
        
    } catch(error) {
        // nếu lỗi là HttpError thì trả về payload lỗi và status code tương ứng
        if (error instanceof HttpError) {
            return Response.json(error.payload, {status: error.status})
        }
        // nếu lỗi không xác định thì trả về thông báo lỗi và status code 500
        else {
            return Response.json({
                message: "Lỗi không xác định"
            },
        {
            status: 500
        })
        }
    }
  
}

    
