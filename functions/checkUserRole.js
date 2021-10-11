const checkUserRole = (role) => {
    if (message.member.roles.cache.has(role)) return true
}

exports.checkUserRole = checkUserRole