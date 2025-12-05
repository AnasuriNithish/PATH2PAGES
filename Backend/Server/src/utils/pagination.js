exports.paginate = (model, match = {}, page = 1, limit = 20, sort = { createdAt: -1 }) => {
    const skip = (page - 1) * limit;
    return model.find(match).sort(sort).skip(skip).limit(limit);
};