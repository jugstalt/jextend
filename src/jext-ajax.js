(function (jExt) {
  jExt.ajax = function (options) {
    options = options || {};
    var xhr = new XMLHttpRequest();
    var method = options.type ? options.type.toUpperCase() : "GET";
    var url = options.url || window.location.href;
    var async = options.async !== false;
    var processData = options.processData !== false;
    var contentType =
      options.contentType || "application/x-www-form-urlencoded; charset=UTF-8";
    var data = options.data || null;
    var dataType = options.dataType || "auto";
    var timeout = options.timeout || 0;
    var beforeSend = options.beforeSend || null;

    xhr.onreadystatechange = function () {
      if (xhr.readyState === 4) {
        clearTimeout(requestTimeout);

        if (xhr.status >= 200 && xhr.status < 300) {
          let response = xhr.responseText;
          const contentType = xhr.getResponseHeader("Content-Type");

          if (
            (dataType === "auto" &&
              contentType &&
              contentType.indexOf("application/json") !== -1) ||
            dataType === "json"
          ) {
            response = JSON.parse(response);
          }

          if (options.success) {
            options.success(response, xhr.statusText, xhr);
          }
        } else {
          if (options.error) {
            options.error(xhr, xhr.statusText, xhr.status);
          }
        }

        if (options.complete) {
          options.complete(xhr, xhr.statusText);
        }
      }
    };

    if (options.xhrFields) {
      for (var field in options.xhrFields) {
        if (options.xhrFields.hasOwnProperty(field)) {
          xhr[field] = options.xhrFields[field];
        }
      }
    }

    if (beforeSend) {
      if (beforeSend(xhr, options) === false) {
        return;
      }
    }

    if (processData && typeof data === "object") {
      var serializedData = new URLSearchParams();
      for (var key in data) {
        if (data.hasOwnProperty(key)) {
          serializedData.append(key, data[key]);
        }
      }
      data = serializedData.toString();
    }

    if (method === "GET" && data) {
      url += (url.indexOf("?") === -1 ? "?" : "&") + data;
      data = null;
    }

    xhr.open(method, url, async);

    if (contentType) {
      xhr.setRequestHeader("Content-Type", contentType);
    }

    if (options.headers) {
      for (var header in options.headers) {
        if (options.headers.hasOwnProperty(header)) {
          xhr.setRequestHeader(header, options.headers[header]);
        }
      }
    }

    var requestTimeout =
      timeout > 0
        ? setTimeout(function () {
            xhr.abort();
            if (options.error) {
              options.error(xhr, "timeout", "Request timed out");
            }
            if (options.complete) {
              options.complete(xhr, "timeout");
            }
          }, timeout)
        : null;

    if (data) {
      xhr.send(data);
    } else {
      xhr.send(null);
    }
  };
})(jExt);
