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

        this.correctMessages = [
            'Повезло',
            'Правильно!',
            'Молодец!',
            'Отлично!',
            'Так держать!',
            'Угадали!'
        ];

        this.wrongMessages = [
            'А вот и нет',
            'Неправильно',
            'Не сдавайтесь!'
        ];

        alertify.set({ delay: 2000 });

        $('.game').hide();
        $('.descr').show();

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
            _this.resetInputs();
        });

        $('.controls .start').click(function() {
            $('.controls .start').toggleClass('hidden');
            $('.controls .stop').toggleClass('hidden');
            $('.descr').hide();
            $('.game').show();

            alertify.success('Готовы?');

            _this.nextQuestion();
        });

        $('.controls .stop').click(function(){
            _this.stopTimer();
            $('.controls .start').toggleClass('hidden');
            $('.controls .stop').toggleClass('hidden');

            $('.game').hide();
            $('.descr').show();
        });

        $('.check_tonic').click(function() {
            _this.checkAnswer();
        });

        this.notes = new window.Notes();

    };

    Layout.prototype.resetInputs = function(type) {
        $('.b-sign-type .btn').removeClass('btn-info');
        $('.b-signs-count .btn').removeClass('btn-info');
        $('.b-sign-type .btn:first').addClass('btn-info');
    }

    Layout.prototype.getRandomMessage = function(type) {
        type = type || 'wrong';
        var source = (type === 'wrong') ? this.wrongMessages : this.correctMessages;
        var min = 0;
        var max = source.length - 1;
        var index = Math.ceil( Math.random() * (max - min) + min );
        return source[index];
    }

    Layout.prototype.stopTimer = function() {
        if (this.timer) {
            clearInterval(this.timer);
            this.timer = false;
        }
        this.timeLeft = this.timeLimit;
        $('.time').text(this.timeLimit);
    }

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
        $('.b-note .lang').text(this.tonic.lang.ru);
    }

    Layout.prototype.updateScores = function() {
        $('.correctCount').text(this.correctCount);
        $('.wrongCount').text(this.wrongCount);
        $('.scores').text(this.scores);
    }

    Layout.prototype.onCorrect = function() {
        if (this.timer) {
            this.stopTimer();
            alertify.success(this.getRandomMessage('success'));
            this.scores++;
            this.correctCount++;
            this.nextQuestion();
        }
    }

    Layout.prototype.onWrong = function() {
        if (this.timer) {
            alertify.error(this.getRandomMessage('wrong'));
            this.scores--;
            this.wrongCount++;
            this.updateScores();
        }
    }

    Layout.prototype.onTimeOut = function() {
        if (this.timer) {
            this.stopTimer();
            alertify.error('Time out!');
            this.scores--;
            this.nextQuestion();
        }
    }

    Layout.prototype.nextQuestion = function(alias) {
        this.resetInputs();
        $('.controls .btn').attr('disabled', 'disabled');
        $('.b-note .mus').text('...');
        $('.b-note .lang').text('');
        var _this = this;
        this.updateScores();
        setTimeout(function(){
            _this.generateNote(alias);
            _this.drawNote();
            _this.startTimer();
            $('.controls .btn').removeAttr('disabled');
        }, 2000);
    }

    Layout.prototype.checkAnswer = function() {
        var _this = this;
        var correct = true;
        var sign = $('.b-sign-type .btn-info').data('value')
        if (_this.tonic.sign !== sign) {
            correct = false;
        }
        var count = 0;
        if (sign) {
            count = $('.b-signs-count .btn-info').data('value');
        }
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
