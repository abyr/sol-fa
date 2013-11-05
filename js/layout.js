(function() {
$(function () {

    var Layout, layout;

    Layout = function() {

        this.tonic = false;
        this.tonics = [];

        this.correctCount = 0;
        this.wrongCount = 0;
        this.scores = 0;

        this.timeLimit = 60;
        this.timeLeft = this.timeLimit;
        this.timer = false;

        alertify.set({ delay: 2000 });

        var _this = this;

        $('.b-sign-type .btn').click(function(){
            $('.b-sign-type .btn').removeClass('btn-info');
            $(this).addClass('btn-info');
        });

        $('.b-signs-count .btn').click(function(){
            $('.b-signs-count .btn').removeClass('btn-info');
            $(this).addClass('btn-info');
        });

        $('.btn-info').click(function(){
            $('.b-sign-type .btn').removeClass('btn-info');
            $('.b-signs-count .btn').removeClass('btn-info');
            $('.b-sign-type .btn:first').addClass('btn-info');
            $('.b-signs-count .btn:first').addClass('btn-info');
        });

        $('.check_tonic').click(function() {
            _this.checkAnswer();
        });

        this.notes = new window.Notes();

        // manual start
        alertify.log('Guess signs');
        alertify.success('Start!');
        this.nextQuestion('C');

    };

    Layout.prototype.startTimer = function() {
        var _this = this;
        if (this.timer) {
            $('.time').removeClass('wrong');
            clearInterval(_this.timer);
            this.timeLeft = this.timeLimit;
        }
        $('.time').text(this.timeLimit);
        this.timer = setInterval(function() {
            _this.timeLeft = _this.timeLeft-1;
            if (_this.timeLeft <= 0) {
                _this.timeOut();
            }
            _this.updateTimer();
        }, 1000);
    }

    Layout.prototype.updateTimer = function() {
        $('.time').text(this.timeLeft);
    }
    Layout.prototype.timeOut = function() {
        clearInterval(this.timer);
        $('.time').addClass('wrong').text('0');
        this.onTimeOut();
    }

    Layout.prototype.generateNote = function(alias) {
        var tonics = this.notes.getTonic(alias);
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

    Layout.prototype.updateScores = function() {
        $('.correctCount').text(this.correctCount);
        $('.wrongCount').text(this.wrongCount);
        $('.scores').text(this.scores);
    }

    Layout.prototype.onCorrect = function() {
        alertify.success('Correct');
        this.scores++;
        this.correctCount++;
        this.nextQuestion();
    }

    Layout.prototype.onWrong = function() {
        alertify.error('Wrong');
        this.scores--;
        this.wrongCount++;
        this.updateScores();
    }

    Layout.prototype.onTimeOut = function() {
        alertify.error('Time out!');
        this.scores--;
        this.nextQuestion();
    }

    Layout.prototype.nextQuestion = function(alias) {
        var _this = this;
        this.updateScores();
        setTimeout(function(){
            _this.generateNote(alias);
            _this.drawNote();
            _this.startTimer();
        }, 2000);
    }

    Layout.prototype.checkAnswer = function() {
        var _this = this;
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
            _this.onCorrect();
        } else {
            _this.onWrong();
        }
    }

    layout = new Layout();

});
}).call(this);
