var searchFunc = function (path, searchId, contentId) {
    var BTN = '<i id="local-search-close">x</i>';
    $.ajax({
        url: path,
        dataType: 'xml',
        success: function (xmlResponse) {
            var datas = $('entry', xmlResponse).map(function () {
                return {
                    title: $('title', this).text(),
                    content: $('content', this).text(),
                    url: $('url', this).text()
                };
            }).get();

            var $input = document.getElementById(searchId);
            var $resultContent = document.getElementById(contentId);

            $input.addEventListener('input', function () {
                var str = '<ul class="search-result-list">';
                var keywords = this.value.trim().toLowerCase().split(/[\s\-]+/);
                $resultContent.innerHTML = '';
                if (this.value.trim().length <= 0) {
                    return;
                }
                datas.forEach(function (data) {
                    var isMatch = true;
                    if (!data.title || data.title.trim() === '') {
                        data.title = 'Untitled';
                    }
                    var dataTitle = data.title.trim().toLowerCase();
                    var dataContent = data.content.trim().replace(/<[^>]+>/g, '').toLowerCase();
                    var dataUrl = data.url;
                    var indexTitle = -1;
                    var indexContent = -1;
                    var firstOccur = -1;
                    if (dataContent !== '') {
                        keywords.forEach(function (keyword, i) {
                            indexTitle = dataTitle.indexOf(keyword);
                            indexContent = dataContent.indexOf(keyword);

                            if (indexTitle < 0 && indexContent < 0) {
                                isMatch = false;
                            } else {
                                if (indexContent < 0) {
                                    indexContent = 0;
                                }
                                if (i === 0) {
                                    firstOccur = indexContent;
                                }
                            }
                        });
                    } else {
                        isMatch = false;
                    }
                    if (isMatch) {
                        str += '<li><a href="' + dataUrl + '" class="search-result-title">' + dataTitle + '</a>';
                        var content = data.content.trim().replace(/<[^>]+>/g, '');
                        if (firstOccur >= 0) {
                            var start = firstOccur - 20;
                            var end = firstOccur + 80;

                            if (start < 0) {
                                start = 0;
                            }

                            if (start === 0) {
                                end = 100;
                            }

                            if (end > content.length) {
                                end = content.length;
                            }

                            var matchContent = content.substr(start, end);

                            keywords.forEach(function (keyword) {
                                var regS = new RegExp(keyword, 'gi');
                                matchContent = matchContent.replace(
                                    regS, '<em class=\"search-keyword\">' + keyword + '</em>');
                            });

                            str += '<p class="search-result">' + matchContent + '...</p>';
                        }
                        str += '</li>';
                    }
                });
                str += '</ul>';
                if (str.indexOf('<li>') === -1) {
                    return $resultContent.innerHTML = BTN + '<ul><span class="local-search-empty">没有找到内容，更换下搜索词试试吧~<span></ul>';
                }
                $resultContent.innerHTML = BTN + str;
            });
        }
    });
};
$(document).on('click', '#local-search-close', function () {
    $('#local-search-input').val('');
    $('#local-search-result').html('');
});

searchFunc('/search.xml', 'local-search-input', 'local-search-result');