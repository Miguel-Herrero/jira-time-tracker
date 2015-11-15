function JiraAPI (baseUrl, apiExtension, username, password) {

    var apiDefaults = {
        type: 'GET',
        url : baseUrl + apiExtension,
        headers: {
            'Content-Type': 'application/json'
        },
        contentType: 'application/json',
        dataType: 'json'
    };

    return {
        login : login,
        getIssue : getIssue,
        getAssignedIssues: getAssignedIssues,
        getIssueWorklog : getIssueWorklog,
        updateWorklog : updateWorklog
    };



    function login() {
        var url = '/user?username=' + username;
        var options = {
            headers: {
                'Authorization': 'Basic ' + btoa(username + ':' + password)
            }            
        }
        return ajaxWrapper(url, options);
    };

    function getIssue (id) {
        return ajaxWrapper('/issue/' + id);
    }

    function getAssignedIssues () {
        return ajaxWrapper('/search?jql=assignee=' + username.replace('@', '\\u0040') + '+AND status=Done');
    }    

    function getIssueWorklog (id) {
        return ajaxWrapper('/issue/' + id + '/worklog');
    }

    function updateWorklog (id, timeSpent) {
        var url = '/issue/' + id + '/worklog';
        var options = {
            type: 'POST',
            data: JSON.stringify({
                "started": new Date().toISOString().replace('Z', '+0530'), // TODO: Problems with the timezone, investigate
                "timeSpent": timeSpent
            })
        }
        return ajaxWrapper(url, options);
    }

    function toUnicode(str){
        var result = "";
        for(var i = 0; i < str.length; i++){
            result += "\\u" + ("000" + str[i].charCodeAt(0).toString(16)).substr(-4);
        }
        return result;
    }

    function ajaxWrapper (urlExtension, optionsOverrides) {
        var options = $.extend({}, apiDefaults, optionsOverrides);
        options.url += urlExtension;
        return $.ajax(options);
    }

}