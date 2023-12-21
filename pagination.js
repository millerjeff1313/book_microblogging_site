function pagination(req, res, next) {
    const page_size = 5;
    const page = parseInt(req.query.page) || 1;

    const start_index = (page - 1) * page_size;
    const end_index = page * page_size;

    req.pagination = {
        start_index: start_index,
        end_index: end_index,
        page_size: page_size,
        page: page
    }

    next();
}

module.exports = {pagination}