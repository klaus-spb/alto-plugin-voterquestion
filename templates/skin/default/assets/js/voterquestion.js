function is_int(input) {
    return (parseFloat(input) == input);
}
jQuery(document).ready(function ($) {
	$("ul.js-poll-result li").click(function(el){
		var num = $(this).data('poll-item-pos');		  		
		var search_id = $(this).parent().parent().data('poll-id');
		if (is_int(search_id)) {
            ls.voterquestion.getInfo({
                num: num,
                button: this,
                id: search_id
            });
		}
	}); 
	// $("ul[id^='poll-result-original-'] li").click(function(el){
		// var num=($('#'+$(this).closest('ul').attr('id')+' li').index(this));		  		
		// var search_id = $(this).closest('ul').attr('id').split('-')[3]; 
		// if (is_int(search_id)) {
            // ls.voterquestion.getInfo({
                // num: num,
                // button: this,
                // id: search_id
            // });
		// }
	// }); 
	$("ul[id^='poll-result-sort-'] li").click(function(el){
		var num=0;
		
		var search_id = $(this).closest('ul').attr('id').split('-')[3];
		var ihtml = $(this).html();
		$("#poll-result-original-"+search_id+" li").each(function() {			
			if ( ihtml == $(this).html() ) 
				num=($('#'+$(this).closest('ul').attr('id')+' li').index(this));
		});		
		if (is_int(search_id)) {
            ls.voterquestion.getInfo({
                num: num,
                button: this,
                id: search_id
            });
		}
	});
	ls.hook.add('ls_pool_vote_after', function(idTopic, idAnswer,result){ 
		
		$("#poll-result-original-"+idTopic+" li").click(function(el){
			var num=($('#'+$(this).closest('ul').attr('id')+' li').index(this));		  		
			var search_id = $(this).closest('ul').attr('id').split('-')[3]; 
			if (is_int(search_id)) {
				ls.voterquestion.getInfo({
					num: num,
					button: this,
					id: search_id
				});
			}
		});
	
		$("#poll-result-sort-"+idTopic+" li").click(function(el){
			var num=0;
			
			var search_id = $(this).closest('ul').attr('id').split('-')[3];
			var ihtml = $(this).html();
			$("#poll-result-original-"+search_id+" li").each(function() {			
				if ( ihtml == $(this).html() ) 
					num=($('#'+$(this).closest('ul').attr('id')+' li').index(this));
			});		
			if (is_int(search_id)) {
				ls.voterquestion.getInfo({
					num: num,
					button: this,
					id: search_id
				});
			}
		});
		
	
	});
});

var ls = ls || {};

ls.voterquestion = (function ($) {

    this.closeDiv = function () {
        $('#vs-votequestion').css('display', 'none');
        $(ls.voterquestion.button).removeClass('js-vs');
        $(ls.voterquestion.button).removeClass('js-vs_waiting');
        ls.voterquestion.opened = false;
		
    },

    this.getInfo = function (params) {
		if ($('#vs-vote').length) {
			ls.voter.closeDiv();
		}
        if ($('#vs-votequestion').length) {
			$('#vs-votequestion .vs_plus_users').height(0);

            if ($(params.button).hasClass('js-vs_loading')) {
                return false;
            }
            if ($(params.button).hasClass('js-vs')) {
                ls.voterquestion.closeDiv();
                return false;
            }
            if (ls.voterquestion.loading) {
                ls.voterquestion.closeDiv();
            }
            if (ls.voterquestion.opened) {
                ls.voterquestion.closeDiv();
            }
            ls.voterquestion.loading = true;
            ls.voterquestion.button = params.button;
            $(params.button).addClass('js-vs_loading');

            var params_to = {};
            params_to['id'] = params.id;
            params_to['num'] = params.num;
            params_to['security_ls_key'] = ALTO_SECURITY_KEY;
            var data = params_to;
            var url = aRouter['ajax'] + 'vote/whovotequestion/';

            $(params.button).addClass('js-vs_waiting');
            ls.ajax(url, params_to, function (response) {
                if (!response) {
                    ls.msg.error('Error', 'Please try again later');
                }
                if (response.bStateError) {
                    ls.msg.error(response.sMsgTitle, response.sMsg);
                } else {
                    $(params.button).removeClass('js-vs_loading');
                    if (!$(params.button).hasClass('js-vs_waiting')) {
                        return false;
                    }
                    ls.voterquestion.loading = false;
                    $(params.button).removeClass('js-vs_waiting');
                    $(params.button).addClass('js-vs');
                    plus_minus = '';
                    if (response.rating > 0) plus_minus = '+';

                        $('#vs-votequestion .vs_header').html(response.vote_for_this + ' - <em>' +  response.count_votes + '</em>');
                        
          
                    var minusArray = [
                        []
                    ];
                    var plusArray = [
                        []
                    ];
                    var minusPageCounter = 0;
                    var plusPageCounter = 0;

                    $.each(response.votes, function () {
							if (plusArray[plusPageCounter].length == 10) {
                                plusArray[++plusPageCounter] = [];
                            }
                            plusArray[plusPageCounter].push(this);
                    }); 
                    var plusCol = plusPageCounter * 10 + plusArray[plusPageCounter].length;
                    var overallPages = plusPageCounter + 1; 
                    ls.voterquestion.overallPages = overallPages;
                    ls.voterquestion.plusArray = plusArray; 
                    ls.voterquestion.activePage = 0;
                    if (plusPageCounter < 2 && minusPageCounter < 2) {
                        $('#vs-votequestion').find('.vs_paginator, .vs_users_prev, .vs_users_next').css('display', 'none');
                    } else {
                        $('#vs-votequestion').find('.vs_paginator, .vs_users_next').css('display', 'block');
                        $('#vs-votequestion .vs_users_prev').css('display', 'none');
                        var html_addpaginator = '';
                        html_addpaginator += '<a href="#" onclick="ls.voterquestion.setPage(0); return false;" class="active"> </a>';
                        for (var i = 2; i < overallPages; i=i+2) {
                            html_addpaginator += '<a href="#" onclick="ls.voterquestion.setPage(' + i + '); return false;"> </a>';
                        }
                        $('#vs-votequestion .vs_pag_inner_2').html(html_addpaginator);
                    }
                    if (plusCol == 0) {
                        var html_addplus = '<ul class="vs_users"></ul>';
                    } else {
                        var html_addplus = '<ul class="vs_users">';
                        html_addplus += ls.voterquestion.createUsersLi(plusArray[0]);
                        html_addplus += '</ul>';
                    }
                    if (((plusCol-1)/10) < 1) {
                         var html_addplus2 = '<ul class="vs_users"></ul>';
                    } else {

                          var html_addplus2 = '<ul class="vs_users">';
                          html_addplus2 += ls.voterquestion.createUsersLi(plusArray[1]);
                          html_addplus2 += '</ul>';
                    } 

                    $('#vs-votequestion .vs_plus_users').html(html_addplus);
                    $('#vs-votequestion .vs_plus_users2').html(html_addplus2);
					$('#vs-votequestion').css({
						'display': 'block',
						'position': 'absolute',
						'top': '-10000px',
						'left': '-10000px'
					});
					var offset = $(params.button).offset();
					var x = offset.left;
					var y = offset.top;
					var y1 = $(params.button).offset().top - $(window).scrollTop();
					var y2 = $(window).height() - y1 - $(params.button).height();
					var win_height = $('#vs-votequestion').height();
					if (y1 <= y2) {
						var putToBottom = true;
					} else {
						var putToBottom = false;
					}
					if (!putToBottom) {
						if ($(params.button).offset().top <= win_height) {
							putToBottom = true;
						}
					}

					if (putToBottom) {
						$('#vs-votequestion').css({
							'top': $(params.button).offset().top + $(params.button).height() - 5 + 'px',
							'left': $(params.button).offset().left - 10 + 'px'
						});
						$('#vs-votequestion .vs_arrow_bubble_top').css('display', 'block');
						$('#vs-votequestion .vs_arrow_bubble_top').css('background-position', '0px 0');
						$('#vs-votequestion .vs_arrow_bubble_bottom').css('display', 'none');
					} else {
						$('#vs-votequestion').css({
							'top': $(params.button).offset().top - win_height + 5 + 'px',
							'left': $(params.button).offset().left - 10 + 'px'
						});
						$('#vs-votequestion .vs_arrow_bubble_top').css('display', 'none');
						$('#vs-votequestion .vs_arrow_bubble_bottom').css('display', 'block');
						$('#vs-votequestion .vs_arrow_bubble_bottom').css('background-position', '0px 0');
					}
					ls.voterquestion.opened = true;
					ls.voterquestion.height_td = $('#vs-votequestion .vs_plus_users').height();
                }
            });									
        } 
    },
    this.prevPage = function () {
        ls.voterquestion.setPage(ls.voterquestion.activePage - 2);
    },
    this.nextPage = function () { 
        ls.voterquestion.setPage(ls.voterquestion.activePage + 2);
    },
    this.setPage = function (num) {
        var html_addplus = '';
		$('#vs-votequestion .vs_plus_users').height(ls.voterquestion.height_td);
        if (num != ls.voterquestion.activePage) {
            ls.voterquestion.activePage = num;
            if (num == ls.voterquestion.overallPages - 1) {
                $('#vs-votequestion .vs_users_next').css('display', 'none');
            } else {
                $('#vs-votequestion .vs_users_next').css('display', 'block');
            }
            if (num == 0) {
                $('#vs-votequestion .vs_users_prev').css('display', 'none');
            } else {
                $('#vs-votequestion .vs_users_prev').css('display', 'block');
            }
            $('#vs-votequestion .vs_paginator .active').removeClass('active');
            $('#vs-votequestion .vs_paginator a:eq(' + num/2 + ')').addClass('active');
            var html_addplus = '';
            if (ls.voterquestion.plusArray[num]) {
                html_addplus += ls.voterquestion.createUsersLi(ls.voterquestion.plusArray[num]);
            }
            $('#vs-votequestion .vs_plus_users .vs_users').html(html_addplus);
            var html_addplus2 = '';
            if (ls.voterquestion.plusArray[num+1]) {
                 html_addplus2 += ls.voterquestion.createUsersLi(ls.voterquestion.plusArray[num+1]);
            }
             $('#vs-votequestion .vs_plus_users2 .vs_users').html(html_addplus2);
        }
    },
    
    this.createUsersLi = function (people) {
        var html_add = ''; 
        $.each(people, function () {
            html_add += '<li>';
            html_add += '<a href="' + aRouter['profile'] + this.login + '">' + this.login + '</a> '; 
            html_add += '</li>';
        }); 
        return html_add;
    }

    return this;
}).call(ls.voterquestion || {}, jQuery);