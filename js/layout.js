Doc(document).ready(function () {
    var _ = window._,
        alerts = window.alerts,
        Messages = window.Messages,
        Layout, layout;

    alerts.settings.container = Doc('.alerts_container')[0];

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

        var view = this;

        this.settings = {
            fret: '',
            signs_count: 7
        };

        this.init = function () {
            Doc('.settings .frets .btn').on('click', this.onSelectType);
            Doc('.answers .frets .btn').on('click', this.onAnswerType);
            Doc('.settings .signs_count .btn').on('click', this.onSelectSignsCount);
            Doc('.answers .signs_count .btn').on('click', this.onAnswerSignsCount);
        };

        this.onSelectType = function (evnt) {
            var el = Doc(evnt.target);

            Doc('.settings .frets .btn').removeClass('active');
            el.addClass('active');
            view.settings.fret = el.attr('data-value');
        };

        this.onSelectSignsCount = function (evnt) {
            var el = Doc(evnt.target);

            Doc('.settings .signs_count .btn').removeClass('active');
            el.addClass('active');
            view.settings.signs_count = el.attr('data-value');
        };

        this.onAnswerType = function (evnt) {
            Doc('.answers .frets .btn').removeClass('active');
            Doc(evnt.target).addClass('active');
        };

        this.onAnswerSignsCount = function (evnt) {
            Doc('.answers .signs_count .btn').removeClass('active');
            Doc(evnt.target).addClass('active');
        };

        Doc('.controls .start').on('click', function () {
            Doc('.controls .start').toggleClass('hidden');
            Doc('.controls .stop').toggleClass('hidden');
            Doc('.tips').hide();
            Doc('.gameboard').show();
            Doc('.status').show();

            alerts.log(messages.getIsReadyMessage());

            view.nextQuestion();
        });

        Doc('.controls .stop').on('click', function () {
            view.stopTimer();
            Doc('.controls .start').toggleClass('hidden');
            Doc('.controls .stop').toggleClass('hidden');

            Doc('.gameboard').hide();
            Doc('.tips').show();
        });

        Doc('.check').on('click', function( ) {
            view.checkAnswer();
        });

        this.notes = new window.Notes();

    };

    Layout.prototype.getRandomMessage = function (type) {
        if (type === 'success') {
            this.messages.getCorrectMessage();
        } else {
            this.messages.getErrorMessage();
        }
    };

    Layout.prototype.stopTimer = function () {
        if (this.timer) {
            clearInterval(this.timer);
            this.timer = false;
        }
        this.timeLeft = this.timeLimit;
        Doc('.time').text(this.timeLimit);
    };

    Layout.prototype.startTimer = function () {
        var view = this;
        if (this.timer) {
            Doc('.time').removeClass('wrong');
            clearInterval(view.timer);
            this.timeLeft = this.timeLimit;
        }

        Doc('.time').removeClass('wrong').text(this.timeLimit);
        this.timer = setInterval(function() {
            view.timeLeft = view.timeLeft-1;
            if (view.timeLeft <= 0) {
                view.timeOut();
            }
            view.updateTimer();
        }, 1000);
        this.startTime = +new Date();
    };

    Layout.prototype.getFret = function () {
        return this.settings.fret;
    };
    Layout.prototype.getMaxSignsCount = function () {
        return this.settings.signs_count || 7;
    };

    Layout.prototype.updateTimer = function () {
        Doc('.time').text(this.timeLeft);
    };
    Layout.prototype.timeOut = function () {
        clearInterval(this.timer);
        Doc('.time').addClass('wrong').text('0');
        this.onTimeOut();
    };

    Layout.prototype.generateNote = function (alias) {
        var tonics = [],
            filters;

        if (alias) {
            tonics = this.notes.getTonic(alias);
        } else {
            filters = {
                lad: this.getFret(),
                maxSignsCount: this.getMaxSignsCount()
            };
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
    };

    Layout.prototype.drawNote = function () {
        Doc('.gameboard .mus').text(this.tonic.alias);
        Doc('.gameboard .lang').text(this.tonic.lang.ru);
    };

    Layout.prototype.updateScores = function () {
        Doc('.correctCount').text(this.correctCount);
        Doc('.wrongCount').text(this.wrongCount);
        Doc('.scores').text(this.scores);
    };

    Layout.prototype.updateAverageTime = function () {
        this.averageTime = this.totalTime / this.correctCount;
        var averageSeconds = Math.floor(this.averageTime / 1000);
        Doc('.averageTime').text(averageSeconds + ' с');
    };

    Layout.prototype.onCorrect = function () {
        if (this.timer) {
            this.stopTimer();
            this.totalTime += +new Date() - this.startTime;
            this.scores++;
            this.correctCount++;

            alerts.success(this.messages.getSuccessMessage());

            this.updateAverageTime();
            this.nextQuestion();
        }
    };

    Layout.prototype.onWrong = function () {
        if (this.timer) {
            alerts.error(this.messages.getErrorMessage());
            this.scores--;
            this.wrongCount++;
            this.updateScores();
        }
    };

    Layout.prototype.onTimeOut = function () {
        if (this.timer) {
            this.stopTimer();
            alerts.error('Time out!');
            this.scores--;
            this.nextQuestion();
        }
    };

    Layout.prototype.resetInputs = function(type) {
        Doc('.answers .btn').removeClass('active');
        Doc('.answers .frets .btn')[0].addClass('active');
    };

    Layout.prototype.nextQuestion = function (alias) {
        this.resetInputs();

        Array.prototype.forEach.call(Doc('.controls .btn'), function (el, i) {
            el.attr('disabled', 'disabled');
        });

        Doc('.gameboard .mus')[0].text('...');
        Doc('.gameboard .lang')[0].text('');
        var view = this;
        this.updateScores();
        setTimeout(function () {
            view.generateNote(alias);
            view.drawNote();
            view.startTimer();
            Doc('.controls .btn').removeAttr('disabled');
        }, 2000);
    };

    Layout.prototype.checkAnswer = function () {
        var view = this;
        var correct = true;
        var sign = Doc('.answers .frets .active')[0].attr('data-value');

        if (this.tonic.sign !== sign) {
            correct = false;
        }

        var count = 0;
        if (sign) {
            count = Doc('.answers .signs_count .active')[0].attr('data-value');
        }

        if (this.tonic.signs !== +count) {
            correct = false;
        }

        if (correct) {
            this.onCorrect();
        } else {
            this.onWrong();
        }
    };

    layout = new Layout();
    layout.init();

});
