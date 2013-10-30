(function() {
$(function () {

    var Layout, layout;

    Layout = function() {

        this.tonic = false;
        this.tonics = [];

        var _this = this;

        $('.b-sign-type .btn').click(function(){
            $('.b-sign-type .btn').removeClass('btn-info');
            $(this).addClass('btn-info');
        });

        $('.b-signs-count .btn').click(function(){
            $('.b-signs-count .btn').removeClass('btn-info');
            $(this).addClass('btn-info');
        });

        $('.check_tonic').click(function() {
            var correct = true;
            var sign = $('.b-sign-type .btn-info').data('value')
            if (_this.tonic.sign !== sign) {
                correct = false;
            }
            var count = $('.b-signs-count .btn-info').data('value');
            if (_this.tonic.signs !== count) {
                correct = false;
            }
            if (correct) {
                alertify.success('Correct');
                _this.generateNote();
                _this.drawNote();
            } else {
                alertify.error('Wrong');
            }
        });

        this.notes = new window.Notes();

        this.generateNote('C');

        this.drawNote();

    };

    Layout.prototype.generateNote = function(alias) {
        var tonics = this.notes.getTonic(alias);
        console.log(tonics);
        if (tonics.length) {
            this.tonics = tonics;
            this.tonic = _.first(tonics);
        } else {
            this.tonic = false;
            this.tonics = [];
            console.error('Incorrect tonic', alias);
        }
        return this.tonic;
    }

    Layout.prototype.drawNote = function() {
        $('.b-note .mus').text(this.tonic.alias);
    }

    layout = new Layout();

});
}).call(this);
