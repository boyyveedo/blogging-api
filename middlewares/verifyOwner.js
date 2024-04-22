const verifyOwner = async (req, res, next) => {
    // Check if user is logged in and if they are the owner
    if (!req.user || req.user.id !== req.params.authorId) {
        return res.status(403).json({ msg: "Unauthorized access" });
    }
    next();
};