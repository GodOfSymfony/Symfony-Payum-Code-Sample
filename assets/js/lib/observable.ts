import _ = require('lodash');

// Based on Backbone.Events
class Observable {
    private eventSplitter = /\s+/;
    private _events: any;
    private _listeners: any;
    private _listenId: any;
    private _listeningTo: any;

    public on(name, callback, context?) {
        return this.internalOn(this, name, callback, context);
    }

    // Inversion-of-control versions of `on`. Tell *this* object to listen to
    // an event in another object... keeping track of what it's listening to
    // for easier unbinding later.
    public listenTo(obj, name, callback?) {
        if (!obj) {
            return this;
        }

        var id = obj._listenId || (obj._listenId = _.uniqueId('l'));
        var listeningTo = this._listeningTo || (this._listeningTo = {});
        var listening = listeningTo[id];

        // This object is not listening to any other events on `obj` yet.
        // Setup the necessary references to track the listening callbacks.
        if (!listening) {
            var thisId = this._listenId || (this._listenId = _.uniqueId('l'));

            listening = listeningTo[id] = {obj: obj, objId: id, id: thisId, listeningTo: listeningTo, count: 0};
        }

        // Bind callbacks on obj, and keep track of them on listening.
        this.internalOn(obj, name, callback, this, listening);

        return this;
    }

    // Remove one or many callbacks. If `context` is null, removes all
    // callbacks with that function. If `callback` is null, removes all
    // callbacks for the event. If `name` is null, removes all bound
    // callbacks for all events.
    public off(name, callback, context?) {
        if (!this._events) {
            return this;
        }

        this._events = this.eventsApi(_.bind(this.offApi, this), this._events, name, callback, {
            context: context,
            listeners: this._listeners
        });

        return this;
    }

    // Tell this object to stop listening to either specific events ... or
    // to every object it's currently listening to.
    public stopListening(obj, name, callback) {
        var listeningTo = this._listeningTo;

        if (!listeningTo) {
            return this;
        }

        var ids = obj ? [obj._listenId] : _.keys(listeningTo);

        for (var i = 0; i < ids.length; i++) {
            var listening = listeningTo[ids[i]];

            // If listening doesn't exist, this object is not currently
            // listening to obj. Break out early.
            if (!listening) {
                break;
            }

            listening.obj.off(name, callback, this);
        }

        if (_.isEmpty(listeningTo)) {
            this._listeningTo = void 0;
        }

        return this;
    }

    // Bind an event to only be triggered a single time. After the first time
    // the callback is invoked, its listener will be removed. If multiple events
    // are passed in using the space-separated syntax, the handler will fire
    // once for each event, not once for a combination of all events.
    public once(name, callback, context?) {
        // Map the event into a `{event: once}` object.
        var events = this.eventsApi(_.bind(this.onceMap, this), {}, name, callback, _.bind(this.off, this));

        return this.on(events, void 0, context);
    }

    // Inversion-of-control versions of `once`.
    public listenToOnce(obj, name, callback?) {
        // Map the event into a `{event: once}` object.
        var events = this.eventsApi(_.bind(this.onceMap, this), {}, name, callback, _.bind(this.stopListening, this, obj));

        return this.listenTo(obj, events);
    }

    // Trigger one or many events, firing all bound callbacks. Callbacks are
    // passed the same arguments as `trigger` is, apart from the event name
    // (unless you're listening on `"all"`, which will cause your callback to
    // receive the true name of the event as the first argument).
    public trigger(name, ...args: any[]) {
        if (!this._events) {
            return this;
        }

        this.eventsApi(_.bind(this.triggerApi, this), this._events, name, void 0, args);

        return this;
    }

    // Handles triggering the appropriate event callbacks.
    private triggerApi(objEvents, name, cb, args) {
        if (objEvents) {
            var events = objEvents[name];
            var allEvents = objEvents.all;

            if (events && allEvents) {
                allEvents = allEvents.slice();
            }

            if (events) {
                this.triggerEvents(events, args);
            }

            if (allEvents) {
                this.triggerEvents(allEvents, [name].concat(args));
            }
        }

        return objEvents;
    }

    // A difficult-to-believe, but optimized internal dispatch function for
    // triggering events. Tries to keep the usual cases speedy (most internal
    // Backbone events have 3 arguments).
    private triggerEvents(events, args) {
        var ev, i = -1, l = events.length, a1 = args[0], a2 = args[1], a3 = args[2];

        switch (args.length) {
            case 0:
                while (++i < l) {
                    (ev = events[i]).callback.call(ev.ctx);
                }

                return;
            case 1:
                while (++i < l) {
                    (ev = events[i]).callback.call(ev.ctx, a1);
                }

                return;
            case 2:
                while (++i < l) {
                    (ev = events[i]).callback.call(ev.ctx, a1, a2);
                }

                return;
            case 3:
                while (++i < l) {
                    (ev = events[i]).callback.call(ev.ctx, a1, a2, a3);
                }

                return;
            default:
                while (++i < l) {
                    (ev = events[i]).callback.apply(ev.ctx, args);
                }

                return;
        }
    }

    // The reducing API that removes a callback from the `events` object.
    private offApi(events, name, callback, options) {
        if (!events) {
            return;
        }

        var i = 0, listening;
        var context = options.context, listeners = options.listeners;

        // Delete all events listeners and "drop" events.
        if (!name && !callback && !context) {
            var ids = _.keys(listeners);
            for (; i < ids.length; i++) {
                listening = listeners[ids[i]];
                delete listeners[listening.id];
                delete listening.listeningTo[listening.objId];
            }
            return;
        }

        var names = name ? [name] : _.keys(events);
        for (; i < names.length; i++) {
            name = names[i];
            var handlers = events[name];

            // Bail out if there are no events stored.
            if (!handlers) {
                break;
            }

            // Replace events if there are any remaining.  Otherwise, clean up.
            var remaining = [];
            for (var j = 0; j < handlers.length; j++) {
                var handler = handlers[j];
                if (
                    callback && callback !== handler.callback &&
                    callback !== handler.callback._callback ||
                    context && context !== handler.context
                ) {
                    remaining.push(handler);
                } else {
                    listening = handler.listening;
                    if (listening && --listening.count === 0) {
                        delete listeners[listening.id];
                        delete listening.listeningTo[listening.objId];
                    }
                }
            }

            // Update tail event if the list has any events.  Otherwise, clean up.
            if (remaining.length) {
                events[name] = remaining;
            } else {
                delete events[name];
            }
        }

        if (_.size(events)) {
            return events;
        }
    }

    // Reduces the event callbacks into a map of `{event: onceWrapper}`.
    // `offer` unbinds the `onceWrapper` after it has been called.
    private onceMap(map, name, callback, offer) {
        if (callback) {
            var once:any = map[name] = _.once(function() {
                offer(name, once);
                callback.apply(this, arguments);
            });
            once._callback = callback;
        }

        return map;
    }

    // Guard the `listening` argument from the public API.
    private internalOn(obj, name, callback, context, listening?) {
        obj._events = this.eventsApi(_.bind(this.onApi, this), obj._events || {}, name, callback, {
            context: context,
            ctx: obj,
            listening: listening
        });

        if (listening) {
            var listeners = obj._listeners || (obj._listeners = {});
            listeners[listening.id] = listening;
        }

        return obj;
    }

    // The reducing API that adds a callback to the `events` object.
    private onApi(events, name, callback, options) {
        if (callback) {
            var handlers = events[name] || (events[name] = []);
            var context = options.context, ctx = options.ctx, listening = options.listening;
            if (listening) {
                listening.count++;
            }

            handlers.push({ callback: callback, context: context, ctx: context || ctx, listening: listening });
        }

        return events;
    }

    private eventsApi(iteratee, events, name, callback, opts) {
        var i = 0, names;

        if (name && typeof name === 'object') {
            // Handle event maps.
            if (callback !== void 0 && 'context' in opts && opts.context === void 0) {
                opts.context = callback;
            }

            for (names = _.keys(name); i < names.length ; i++) {
                events = this.eventsApi(iteratee, events, names[i], name[names[i]], opts);
            }
        } else if (name && this.eventSplitter.test(name)) {
            // Handle space separated event names by delegating them individually.
            for (names = name.split(this.eventSplitter); i < names.length; i++) {
                events = iteratee(events, names[i], callback, opts);
            }
        } else {
            // Finally, standard events.
            events = iteratee(events, name, callback, opts);
        }

        return events;
    }
}

export = Observable;
