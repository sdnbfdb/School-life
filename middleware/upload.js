// 文件类型和大小限制
const FILE_TYPES = {
  image: {
    mimeTypes: ['image/jpeg', 'image/png', 'image/gif'],
    maxSize: 5 * 1024 * 1024, // 5MB
    allowedRoles: ['all']
  },
  resume: {
    mimeTypes: ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
    maxSize: 10 * 1024 * 1024, // 10MB
    allowedRoles: ['student']
  },
  company_logo: {
    mimeTypes: ['image/jpeg', 'image/png'],
    maxSize: 2 * 1024 * 1024, // 2MB
    allowedRoles: ['company']
  }
}

// 文件上传中间件
export const validateUpload = (req, res, next) => {
  const { type } = req.body
  const file = req.files?.file
  const userRole = req.user.role

  // 检查文件类型配置
  const typeConfig = FILE_TYPES[type]
  if (!typeConfig) {
    return res.status(400).json({ error: '不支持的文件类型' })
  }

  // 检查用户权限
  if (typeConfig.allowedRoles !== 'all' && !typeConfig.allowedRoles.includes(userRole)) {
    return res.status(403).json({ error: '没有权限上传此类型文件' })
  }

  // 检查文件MIME类型
  if (!typeConfig.mimeTypes.includes(file.mimetype)) {
    return res.status(400).json({ error: '文件格式不正确' })
  }

  // 检查文件大小
  if (file.size > typeConfig.maxSize) {
    return res.status(400).json({ error: '文件大小超出限制' })
  }

  next()
} 