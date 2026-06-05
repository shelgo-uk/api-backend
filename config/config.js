module.exports = {
    ftp: {
        baseURL: process.env.FTP_BASE_URL || '',
        host: process.env.FTP_HOST || '',
        user: process.env.FTP_USER || '',
        password: process.env.FTP_PASSWORD || '',
        secure: process.env.FTP_SECURE === 'true'
    },
    uploadDir: process.env.FTP_UPLOAD_DIR || '/public_html/'
};