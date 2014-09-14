#!/usr/bin/python

# This is a wrapper for the horrendously inconsistent cryptic metadata
# access of mafw currently playing track info. This should be started
# in /etc/event.d
#
# Example:
#
#  dbus-send --print-reply --dest=com.marquarding.trackinfo / \ 
#	com.marquarding.trackinfo.GetArtistAlbumTitleArt
#
#
import os
import gobject
import dbus
import dbus.service
import md5
from dbus.mainloop.glib import DBusGMainLoop
import ctypes

METADATA = {}
MEDIAFILE = ""

# load via ctypes. This  requires the arguments passed as
# byte strings not unicode!
clib = ctypes.CDLL("libhildonthumbnail.so.0")
hildon_album_art_func = clib.hildon_albumart_get_path
hildon_album_art_func.restype = ctypes.c_char_p

def process_metadata(*args):
    global METADATA
    # this signal indicates new song all other metadata will come
    # after this. This is emitted when a new track is selected
    if args[0] == "duration":
	METADATA = {}
    # the rest get emitted when playback starts
    METADATA[str(args[0])] = args[-1]

dbus.mainloop.glib.DBusGMainLoop(set_as_default=True)
BUS = dbus.SessionBus()

BUS.add_signal_receiver(process_metadata,
                        dbus_interface="com.nokia.mafw.renderer",
                        signal_name="metadata_changed",)
			#byte_arrays=True)

class MetadataDBusService(dbus.service.Object):
        def __init__(self):
            bus_name = dbus.service.BusName('com.marquarding.trackinfo', 
                                            bus=BUS)

            dbus.service.Object.__init__(self, bus_name,
                                         '/')

	def _get_albumart(self, album=""):
	    if not album:
	        album = METADATA.get("album", "")
	    if not album:
		return ""
	    # NEED to encode unicode to bytes to get the correct md5 signature
            # from hildon_album_art
	    album = album.encode('utf-8')
	    art = hildon_album_art_func(None, str(album), "album")
            return art #.replace("file://", "")

       	@dbus.service.method('com.marquarding.trackinfo')
        def GetByKey(self, key):
	    return METADATA.get(key, u"")

       	@dbus.service.method('com.marquarding.trackinfo')
        def GetKeys(self):
	    return METADATA.keys()

       	@dbus.service.method('com.marquarding.trackinfo')
        def GetTrackNo(self):
	    return int(METADATA.get("track", 0))

       	@dbus.service.method('com.marquarding.trackinfo')
        def GetDuration(self):
	    return int(METADATA.get("duration", 0))

       	@dbus.service.method('com.marquarding.trackinfo',in_signature='', out_signature='s')
        def GetAlbum(self):
	    return METADATA.get("album", u"")

       	@dbus.service.method('com.marquarding.trackinfo',in_signature='', out_signature='s')
        def GetArtist(self):
	    return METADATA.get("artist", u"")

       	@dbus.service.method('com.marquarding.trackinfo',in_signature='', out_signature='s')
        def GetTitle(self):
	    return METADATA.get("title", u"")

       	@dbus.service.method('com.marquarding.trackinfo',in_signature='', out_signature='s')
	def GetArt(self, album=""):
	    return self._get_albumart(album)

       	@dbus.service.method('com.marquarding.trackinfo',in_signature='', out_signature='as')
        def GetArtistAlbumTitleArt(self):
	    return [METADATA.get("artist", u""),
	            METADATA.get("album", u""),
		    METADATA.get("title", u""),
		    self._get_albumart()]


mdservice = MetadataDBusService()

loop = gobject.MainLoop()
loop.run()
