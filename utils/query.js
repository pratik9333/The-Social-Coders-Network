class Query {
  constructor(base, bigQ) {
    this.base = base;
    this.bigQ = bigQ;
  }

  search() {
    const searchword = this.bigQ.search
      ? {
          name: {
            $regex: this.bigQ.search,
            $options: "i",
          },
        }
      : {};

    this.base = this.base.find({ ...searchword });
    return this;
  }

  sort() {
    this.base = this.base.find().sort({ rating: -1, votes: -1 });
    return this;
  }

  pager(limitPerPage) {
    let initialPage = 1;

    if (this.bigQ.page) {
      initialPage = this.bigQ.page;
    }
    if (this.bigQ.limit) {
      limitPerPage = this.bigQ.limit;
    }

    const skipval = limitPerPage * (initialPage - 1);
    this.base = this.base.limit(limitPerPage).skip(skipval);
    return this;
  }
}

module.exports = Query;
