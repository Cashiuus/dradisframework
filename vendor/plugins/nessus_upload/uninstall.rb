# Uninstall hook code here

for path in [ ['config', 'nessus_upload.yml'] ]
  full_path = File.join(RAILS_ROOT,*path)
  print "  #{path.join('/')} "

  if File.exists?(fullpath)
    print 'exists, it was created by the plugin and is no longer needed, remove [yN]? '
    if gets("\n").chomp.downcase.first == 'y'
      File.delete( full_path )
    else
      puts "    ...skipped";
    end
  end
end
