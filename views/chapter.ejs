<!DOCTYPE html>
<html>
    <head>
        <title><%= title%></title>
        <%include head%>
    </head>
    <body>
        <!-- NAV  -->
        <%include navigation%>
        
        <!-- CHAPTER  -->
        <div class="container-fluid chapter__wrapper">
            <div class="container">
                <div class="row">
                    <div class="col">
                        <div class="chapter">
                            <div class="chapter__pagination">
                                <%if(chap_ID === sess.chapters[index][sess.chapters[index].length - 1].chap_ID) {%>
                                    <a href="#"><i class="fas fa-arrow-left"  style="color: #808080;"></i> </a>
                                <%} else {%>
                                    <a href="/chapter/<%= sess.articles[index].ar_ID%>-<%= chap_ID - 1%>"><i class="fas fa-arrow-left"></i> </a>
                                <%}%>
                                <select onchange="changeChapter(<%= sess.articles[index].ar_ID%>)" id="chapter_select">
                                    <%for(let i = 0; i < sess.chapters[index].length; i++){%>
                                        <% if(chap_ID == sess.chapters[index][i].chap_ID){%>
                                            <option value="<%= sess.chapters[index][i].chap_ID%>" selected><%= sess.chapters[index][i].chap_name%></option>
                                        <%}else{%>
                                            <option value="<%= sess.chapters[index][i].chap_ID%>"><%= sess.chapters[index][i].chap_name%></option>
                                        <%}%>
                                    <%}%>
                                </select>
                                
                                <%if(chapter[0].chap_ID === sess.chapters[index][0].chap_ID) {%>
                                    <a href="#"><i class="fas fa-arrow-right"  style="color: #808080;"></i></a>
                                <%} else {%>
                                    <a href="/chapter/<%= sess.articles[index].ar_ID%>-<%= chap_ID + 1%>"><i class="fas fa-arrow-right"></i></a>
                                <%}%>
                            </div>

                            <div class="chapter__page">
                                <% for(let i = 0; i < chapter[0].chap_page; i++){%>
                                    <img src="/images/chapter/<%= sess.articles[index].ar_ID%>/<%= chap_ID%>/<%= i%>.jpg" alt="">
                                <%}%>
                            </div>
                            
                        
                            <div class="chapter__pagination">
                                <%if(chap_ID === sess.chapters[index][sess.chapters[index].length - 1].chap_ID) {%>
                                    <a href="#"><i class="fas fa-arrow-left"  style="color: #808080;"></i> </a>
                                <%} else {%>
                                    <a href="/chapter/<%= sess.articles[index].ar_ID%>-<%= chap_ID - 1%>"><i class="fas fa-arrow-left"></i> </a>
                                <%}%>
                                <select onchange="changeChapter(<%= sess.articles[index].ar_ID%>)" id="chapter_select">
                                    <%for(let i = 0; i < sess.chapters[index].length; i++){%>
                                        <% if(chap_ID == sess.chapters[index][i].chap_ID){%>
                                            <option value="<%= sess.chapters[index][i].chap_ID%>" selected><%= sess.chapters[index][i].chap_name%></option>
                                        <%}else{%>
                                            <option value="<%= sess.chapters[index][i].chap_ID%>"><%= sess.chapters[index][i].chap_name%></option>
                                        <%}%>
                                    <%}%>
                                </select>
                                
                                <%if(chapter[0].chap_ID === sess.chapters[index][0].chap_ID) {%>
                                    <a href="#"><i class="fas fa-arrow-right"  style="color: #808080;"></i></a>
                                <%} else {%>
                                    <a href="/chapter/<%= sess.articles[index].ar_ID%>-<%= chap_ID + 1%>"><i class="fas fa-arrow-right"></i></a>
                                <%}%>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>


        <div class="container-fluid cmt_footer__wrapper">
            <!-- COMMENT  -->
            <% include comment_section%>

            <!-- FOOTER  -->
            <%include footer%>
        </div>
        
        <!-- FLOATING NAV  -->
        <div class="chapter__nav--floating bg-dark block--active">
            <!-- CHAPTER NAVIGATION -->
            <div class="chapter__pagination">
                <%if(chap_ID === sess.chapters[index][sess.chapters[index].length - 1].chap_ID) {%>
                    <a href="#"><i class="fas fa-arrow-left"  style="color: #808080;"></i> </a>
                <%} else {%>
                    <a href="/chapter/<%= sess.articles[index].ar_ID%>-<%= chap_ID - 1%>"><i class="fas fa-arrow-left"></i> </a>
                <%}%>
                <select onchange="changeChapter(<%= sess.articles[index].ar_ID%>)" id="chapter_select">
                    <%for(let i = 0; i < sess.chapters[index].length; i++){%>
                        <% if(chap_ID == sess.chapters[index][i].chap_ID){%>
                            <option value="<%= sess.chapters[index][i].chap_ID%>" selected><%= sess.chapters[index][i].chap_name%></option>
                        <%}else{%>
                            <option value="<%= sess.chapters[index][i].chap_ID%>"><%= sess.chapters[index][i].chap_name%></option>
                        <%}%>
                    <%}%>
                </select>
                
                <%if(chapter[0].chap_ID === sess.chapters[index][0].chap_ID) {%>
                    <a href="#"><i class="fas fa-arrow-right"  style="color: #808080;"></i></a>
                <%} else {%>
                    <a href="/chapter/<%= sess.articles[index].ar_ID%>-<%= chap_ID + 1%>"><i class="fas fa-arrow-right"></i></a>
                <%}%>
            </div>
            <!-- END OF CHAPTER NAVIGATION -->
        </div>
        <!-- END OF FLOATING NAV  -->
        
        
        <%include main_js%>
        <script>
            $(function(){
                var position = $(window).scrollTop(); 
                $(window).on('scroll', function(){
                    var scroll = $(window).scrollTop();
                    // console.log(scroll);
                    if(scroll > position) {
                        $('.nav__wrapper').removeClass("block--active").addClass("block--disable");
                        $('.chapter__nav--floating').removeClass("block--active").addClass("block--disable");
                    } else {
                        $('.nav__wrapper').removeClass("block--disable").addClass("block--active");
                        if ($('.chapter__pagination').visible(true)) {
                            $('.chapter__nav--floating').removeClass("block--active").addClass("block--disable");
                        }else{
                            $('.chapter__nav--floating').removeClass("block--disable").addClass("block--active");
                        }
                    }
                    position = scroll;
                })
                
            });
        </script>
    </body>
</html>