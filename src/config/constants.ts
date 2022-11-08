export const JwtConstant = {
    secret: 'binh@123',
    expiresIn: '100y'
};

export const MailerConfig = {
  transport: {
    ignoreTLS: true,
    secure: false,
    auth: {
      user: process.env.MAILDEV_INCOMING_USER,
      pass: process.env.MAILDEV_INCOMING_PASS,
    },
  },
  defaults: {
    from: '"No Reply" <no-reply@localhost>',
  },
};