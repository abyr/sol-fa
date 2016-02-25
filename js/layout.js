$(function () {
    var Layout, layout;

    Messages = function () {
        this.correctList = [
            'Да!',
            'Правильно!',
            'Молодец!',
            'Отлично!',
            'Верно!',
            'Так держать!'
        ];

        this.wrongList = [
            'Неправильно',
            'Не сдавайтесь!',
            'Что-то не так'
        ];

        this.isReadyMessage = 'Готовы?';

        this.getRandomIndexInRange = function (min, max) {
            return Math.ceil( Math.random() * (max - min) + min );
        };

        this.getIsReadyMessage = function () {
            return this.isReadyMessage;
        };

        this.getSuccessMessage = function () {
            var list = this.correctList,
                index = Math.floor(Math.random()*list.length);

            return list[index];
        };

        this.getErrorMessage = function () {
            var list = this.wrongList,
                index = Math.floor(Math.random()*list.length);

            return list[index];
        };
    };


    Layout = function () {
        var messages = new Messages();

        this.messages = messages;

        this.tonic = false;
        this.tonics = [];

        this.correctCount = 0;
        this.wrongCount = 0;
        this.scores = 0;

        this.timeLimit = 60;
        this.timeLeft = this.timeLimit;
        this.timer = false;

        this.startTime = 0;
        this.totalTime = 0;
        this.averageTime = 0;

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
        $('.filters-lad .btn-group .btn').click(function(){
            $('.filters-lad .btn-group .btn').removeClass('btn-info');
            $(this).addClass('btn-info');
        });
        $('.filters-count .btn-group .btn').click(function(){
            $('.filters-count .btn-group .btn').removeClass('btn-info');
            $(this).addClass('btn-info');
        });

        $('.btn-info').click(function(){
            _this.resetInputs();
        });

        $('.controls .start').click(function () {
            $('.controls .start').toggleClass('hidden');
            $('.controls .stop').toggleClass('hidden');
            $('.descr').hide();
            $('.game').show();

            alertify.success(messages.getIsReadyMessage());

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

        if (type === 'success') {
            this.messages.getCorrectMessage();
        } else {
            this.messages.getErrorMessage();
        }

        // var source = (type === 'wrong') ? this.wrongMessages : this.correctMessages;
        // var min = -1;
        // var max = source.length - 1;
        // var index = Math.ceil( Math.random() * (max - min) + min );
        // return source[index];
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

        $('.time').removeClass('wrong').text(this.timeLimit);
        this.timer = setInterval(function() {
            _this.timeLeft = _this.timeLeft-1;
            if (_this.timeLeft <= 0) {
                _this.timeOut();
            }
            _this.updateTimer();
        }, 1000);
        this.startTime = +new Date();
    }

    Layout.prototype.getLad = function() {
        return $('.filters-lad .btn-info').data('value') || false;
    }
    Layout.prototype.getMaxSignsCount = function() {
        return $('.filters-count .btn-info').data('value') || 7
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
        var tonics = [];
        if (alias) {
            tonics = this.notes.getTonic(alias);
        } else {
            filters = {
                lad: this.getLad(),
                maxSignsCount: this.getMaxSignsCount()
            }
            tonics = this.notes.getRandomTonic(filters);
        }
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

    Layout.prototype.updateAverageTime = function() {
        this.averageTime = this.totalTime / this.correctCount;
        averageSeconds = Math.floor(this.averageTime / 1000);
        $('.averageTime').text(averageSeconds + ' с');
    }

    Layout.prototype.onCorrect = function() {
        if (this.timer) {
            this.stopTimer();
            this.totalTime += +new Date() - this.startTime;
            this.scores++;
            this.correctCount++;

            alertify.success(this.messages.getSuccessMessage());

            this.updateAverageTime();
            this.nextQuestion();
        }
    }

    Layout.prototype.onWrong = function() {
        if (this.timer) {
            alertify.error(this.messages.getErrorMessage());
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
        if (this.tonic.sign !== sign) {
            correct = false;
        }
        var count = 0;
        if (sign) {
            count = $('.b-signs-count .btn-info').data('value');
        }
        if (this.tonic.signs !== count) {
            correct = false;
        }
        if (correct) {
            this.onCorrect();
        } else {
            this.onWrong();
        }
    }

    layout = new Layout();

});
