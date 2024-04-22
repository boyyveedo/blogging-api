const getTokenFromHeader = (req) => {
    const headerObj = req.headers;

    // Check if Authorization header exists
    if (!headerObj || !headerObj.authorization) {
        console.log("Token not provided");
        return false;
    }

    // Extract token from Authorization header
    const token = headerObj.authorization.split(" ")[1];

    console.log(token);
    return token;
};

module.exports = getTokenFromHeader;
 