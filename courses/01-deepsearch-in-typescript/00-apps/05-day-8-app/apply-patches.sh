#!/bin/bash

for patch in ???-*.patch; do
    if [ -f "$patch" ]; then
        echo "Found patch: $patch"
        echo -n "Apply this patch? (y/n/s/q): "
        read -r response
        
        case "$response" in
            y|Y|yes|Yes)
                echo "Applying $patch..."
                if git apply "$patch"; then
                    echo "✓ Successfully applied $patch"
                else
                    echo "✗ Failed to apply $patch"
                fi
                ;;
            s|S|skip)
                echo "Skipping $patch"
                ;;
            q|Q|quit)
                echo "Quitting..."
                exit 0
                ;;
            *)
                echo "Skipping $patch (default)"
                ;;
        esac
        echo
    fi
done