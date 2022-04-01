module.exports = function () {
    return {
        statusCode: {
            ok: 200,
            created: 201,
            accepted: 202,
            noContent: 204,
            resetContent: 205,
            partialContent: 206,
            requestIsMalformed: 400,
            unauthorized: 401,
            forbidden: 403,
            notFound: 404,
            internalServerError: 500,
            notImplemented: 501,
            badGateway: 502,
            serviceUnavailable: 503,
            gatewayTimeout: 504,
            HTTPVersionNotSupported: 505,
            sessionExpired: 440
        },
        messages: {
            fetched: 'fetched Successfully',
            created: 'Created Successfully',
            updated: 'Updated Successfully',
            deleted: 'Deleted Successfully',
            logout: 'Logged Out Successfully',
            exists: 'Exists',
            notExists: 'Not exists',
            notSaved: 'Not saved',
            misMatch: 'Mismatched',
            loginSuccess : 'Loggedin Successfully',
            wrongPassword: 'Invalid Credential',
            500: 'Internal Server Error',
            400: 'Request Is Malformed',
            404: 'Not found',
            401: 'Unauthorized',            
            440:'Session Expired'
        }
    }
}