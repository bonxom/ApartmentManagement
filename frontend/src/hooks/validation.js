import { z } from 'zod'

export const signUpSchema = z.object({
  name: z
  .string()
  .min(3, 'Họ tên phải có ít nhất 3 ký tự')
  .max(100, 'Họ tên không được quá 100 ký tự')
  .regex(/^[\p{L}\d\s]+$/u, 'Họ tên chỉ chứa chữ cái, số và khoảng trắng'),

  sex: z
    .string()
    .min(1, 'Vui lòng chọn giới tính'),

  userCardID: z
    .string()
    .min(1, 'Vui lòng nhập CCCD')
    .regex(/^\d{12}$/, 'CCCD phải có đúng 12 chữ số'),

  phoneNumber: z
    .string()
    .min(1, 'Vui lòng nhập số điện thoại')
    .regex(/^(0[3|5|7|8|9])+([0-9]{8})$/, 'Số điện thoại không hợp lệ'),
  
  email: z
    .string()
    .min(1, 'Vui lòng nhập email')
    .email('Email không hợp lệ'),
  
  dob: z
    .string()
    .min(1, 'Vui lòng nhập ngày sinh'),

  birthLocation: z
    .string()
    .min(1, 'Vui lòng nhập nơi sinh')
    .max(200, 'Nơi sinh không được quá 200 ký tự'),
  
  job: z
    .string()
    .min(1, 'Vui lòng nhập nghề nghiệp')
    .max(100, 'Nghề nghiệp không được quá 100 ký tự'),

  ethnic: z
    .string()
    .min(1, 'Vui lòng nhập dân tộc')
    .max(50, 'Dân tộc không được quá 50 ký tự'),
  
  password: z
    .string()
    .min(1, 'Vui lòng nhập mật khẩu')
    .min(8, 'Mật khẩu phải có ít nhất 8 ký tự')
    .max(50, 'Mật khẩu không được quá 50 ký tự'),
  
  confirmPassword: z
    .string()
    .min(1, 'Vui lòng xác nhận mật khẩu'),

}).refine((data) => data.password === data.confirmPassword, {
  message: 'Mật khẩu xác nhận không khớp',
  path: ['confirmPassword'],
})

export const signInSchema = z.object({
  email: z
    .string()
    .min(1, 'Vui lòng nhập email')
    .email('Email không hợp lệ'),
  password: z
    .string()
    .min(1, 'Vui lòng nhập mật khẩu')
    .min(6, 'Mật khẩu phải có ít nhất 6 ký tự'),
  // Xóa 'role' và 'citizenId'
})
