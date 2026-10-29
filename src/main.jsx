import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { initSessionActivityTracker } from './api/axiosClient'

// Khởi tạo cơ chế kiểm tra phiên đăng nhập & tự động hết hạn sau 4 tiếng không tương tác (Chuẩn y tế)
initSessionActivityTracker();

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
