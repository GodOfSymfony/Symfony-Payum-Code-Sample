<?php

namespace App\ValueObject\SearchCriteria;

/**
 * Class AttachmentSearchCriteria
 */
final class AttachmentSearchCriteria implements \ArrayAccess
{
    public $path = [];

    public function offsetSet($offset, $value) {
        if (is_null($offset)) {
            $this->path[] = $value;
        } else {
            $this->path[$offset] = $value;
        }
    }

    public function offsetExists($offset) {
        return isset($this->path[$offset]);
    }

    public function offsetUnset($offset) {
        unset($this->path[$offset]);
    }

    public function offsetGet($offset) {
        return isset($this->path[$offset]) ? $this->path[$offset] : null;
    }
}
