import React, { useEffect, useState } from "react";
import { getJWTToken } from "../../API/auth";
import backend from "../../backend";
import axios from "axios";

export default function getFeeds(query, pageNumber) {
  const [feedsData, setFeedsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [moreFeedsLoading, setMoreFeedsLoading] = useState(true);
  const [error, setError] = useState();
  const [hasMore, setHasMore] = useState(false);
  let token = getJWTToken();

  useEffect(() => {
    setFeedsData([]);
  }, [query]);

  useEffect(() => {
    setMoreFeedsLoading(true);
    setError(false);
    let cancel;
    axios({
      method: "GET",
      url: `${backend}/users`,
      headers: { Authorization: `Bearer ${token}` },
      params: { page: pageNumber, search: query },
      cancelToken: new axios.CancelToken((c) => (cancel = c)),
    })
      .then((res) => {
        setFeedsData((prevData) => {
          return [...prevData, ...res.data.Users];
        });
        setHasMore(res.data.filteredUsers > 0);
        setMoreFeedsLoading(false);
        setLoading(false);
      })
      .catch((e) => {
        if (axios.isCancel(e)) return;
        setError(true);
      });
    return () => cancel();
  }, [query, pageNumber]);
  return { loading, error, feedsData, hasMore, moreFeedsLoading };
}
