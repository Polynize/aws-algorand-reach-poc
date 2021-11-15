/**
 * Wrapper for returning data from routes.
 *
 * To return success false, but status 200, specify status
 *
 * Usage:
 *  ret({
 *    res,
 *    success: true | false,
 *    status: number, // If not set and success === true 200, else 500
 *    data: {some: 'data'}, // Only if success === true
 *    error: 'some error' // Only if success === false
 *    message: 'some optional message. E.g. No user found.' // Only if success === true
 *  }})
 *
 * @param {
 *  res: Object
 *  success: boolean
 *  statusCode: number,
 *  data: Object
 *  error: string,
 *  message: string
 * }
 */
module.exports.ret = async function ({ res, req, func }) {
  const authenticatedUser = req?.user ?? {}
  const retObj = await func({ req, authenticatedUser }) ?? {}

  const success = retObj?.success ?? false
  const statusCode = retObj?.statusCode ?? null
  const data = retObj?.data ?? {}
  const error = retObj?.error ?? ''
  const message = retObj?.message ?? ''

  const json = { success, data, error, message }
  if (statusCode) {
    json.statusHttp = statusCode
  } else if (success) {
    json.statusCode = 200
  } else {
    json.statusCode = 500
  }

  return res.status(json.statusCode).json(json)
}
