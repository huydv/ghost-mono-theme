$(document).ready(function () {
        var  monthNames = ["January", "February", "March", "April", "May", "June",
            "July", "August", "September", "October", "November", "December"
        ];
        $.get(
            ghost.url.api('posts', {limit: 'all'})
        ).done(onSuccess);

        function onSuccess(data) {
            showArchive(data.posts);
        }

        function showArchive(posts) {
            var currentMonth = -1;
            var currentYear = -1;
            if (window.location.pathname != '/archive-posts/') {
                return;
            }
            $(posts).each(function(index, value) {
                var datePublished = new Date(value.published_at);
                var postMonth = datePublished.getMonth();
                var postYear = datePublished.getFullYear();
                if (postMonth != currentMonth || postYear != currentYear) {
                    currentMonth = postMonth;
                    currentYear = postYear;

                    $("#postList").append("<br><span><strong>" + monthNames[currentMonth] + " " + currentYear + "</strong></span><br>");
                     $("#postList").append("<span><a href='" + value.url +"'>" + value.title + "</a></span><br>");
                }
            });
         }
});