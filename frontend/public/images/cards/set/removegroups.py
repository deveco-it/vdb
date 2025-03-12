import os
import re

def rename_files(directory):
    files_to_rename = []
    for root, _, files in os.walk(directory):
        for filename in files:
            new_filename = re.sub(r"g[1-9]\.", ".", filename)
            if filename != new_filename:
                old_path = os.path.join(root, filename)
                new_path = os.path.join(root, new_filename)
                files_to_rename.append((old_path, new_path))

    if files_to_rename:
        print("Archivos a renombrar:")
        for old_path, new_path in files_to_rename:
            print(f"Renombrar: {old_path} -> {new_path}")

        confirmacion = input("¿Desea renombrar los archivos? (s/n): ")
        if confirmacion.lower() == "s":
            for old_path, new_path in files_to_rename:
                os.rename(old_path, new_path)
            print("Archivos renombrados.")
        else:
            print("Operación cancelada.")
    else:
        print("No hay archivos para renombrar.")

rename_files(".")