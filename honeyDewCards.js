$(function() {
    Parse.initialize("", "");

    var Card = Parse.Object.extend("Card");

    var currentCard;
    var cards;

    $("#consume-yes").bind("click", function() {
        cards[currentCard].set("cnt", cards[currentCard].get("cnt") - 1);
        Save(cards[currentCard]);
        $("#cnt" + currentCard).html(cards[currentCard].get("cnt"));

        if (cards[currentCard].get("cnt") <= 0) {
            $("#id" + currentCard).unbind("click");
            $("#id" + currentCard).attr("data-theme", "e");
        }
    });

    var query = new Parse.Query(Card);
    query.find({
        success: function(results) {
            //CreateData(results);

            cards = results;

            var listHtml = _.template(
                '<li id="id<%= cardId %>">' +
                    '<a href="#">' +
                    '<img id="img<%= cardId %>" src="apple-touch-icon-144x144-precomposed.png">' +
                    '<h3><%= name %></h3>' +
                    '<p><%= txt %></p>' +
                    '<span id="cnt<%= cardId %>" class="ui-li-count"><%= cnt %></span>' +
                    '</a>' +
                    '</li>');

            for (var i in results) {
                $("#cards").append(listHtml({
                    txt: results[i].get("txt"),
                    name: results[i].get("name"),
                    cnt: results[i].get("cnt"),
                    cardId: i
                }));

                // add click handler
                if (results[i].get("cnt") > 0) {
                    $("#id" + i).bind('click', {myId: i}, function(event) {
                        currentCard = event.data.myId;
                        $("#consume").popup("open");
                    });
                } else {
                    $("#id" + i).attr("data-theme", "e");
                }

                // find an image
                jQuery.ajax({
                    url: "https://api.instagram.com/v1/tags/" + results[i].get("tag") + "/media/recent?access_token=",
                    dataType: "jsonp",
                    context: $("#img" + i),
                    success: function(data) {
                        this.attr("src", data.data[0].images.thumbnail.url);
                    }
                });
            }

            $("#cards").listview('refresh');
        }
    });

    function CreateData(results) {
        // delete existing objects
        for (var i in results) {
            results[i].destroy();
        }

        MakeCard(10, "Break Time!", "Daddy takes Zoë for an hour.", "breaktime");
        MakeCard(10, "Sweet Tooth!", "Daddy makes a dessert.", "dessertporn");
        MakeCard(10, "Tension!", "Mommy gets a massage.", "massage");
        MakeCard(10, "Sleeping In", "Mommy gets to sleep in.", "sleeping");
        MakeCard(10, "Working Man", "Daddy has to take a break from working for at least 2 hours and spend it hanging out with Mommy.", "workingfromhome");
    }

    function MakeCard(cnt, name, txt, tag) {
        var card = new Card();
        card.set("cnt", cnt);
        card.set("name", name);
        card.set("txt", txt);
        card.set("tag", tag);
        Save(card);
    }

    function Save(card) {
        card.save(null, {
            success: function(card) {
                console.log("Saved: " + card.get("txt"));
            },
            error: function(card, error) {
                console.log(error);
            }
        })
    }

});

