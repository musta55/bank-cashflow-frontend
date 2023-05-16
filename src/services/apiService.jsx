const API_ENDPOINT = "http://localhost:5000/api/v1/timeSeries/";

export const fetchBarService = (branch) => {
  return fetch(API_ENDPOINT + branch)
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
      return data;
    })
    .catch((error) => {
      console.error("Error in service", error);
    });
};

export const fetchBarYearService = (branch) => {
  return fetch(API_ENDPOINT + "year/" + branch)
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
      return data;
    })
    .catch((error) => {
      console.error("Error in service", error);
    });
};
